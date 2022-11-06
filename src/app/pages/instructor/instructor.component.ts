import { Component, OnInit } from '@angular/core';
import Web3 from "web3";
import semesters from "../../constants/semesters";
import { collection, doc, Firestore, getDocs, query, setDoc, where} from "@angular/fire/firestore";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {environment} from "../../../environments/environment";
import {Contract} from "web3-eth-contract";
import {sha512} from "js-sha512";
import { NzMessageService} from "ng-zorro-antd/message";
const abi = require('../../../assets/abi.json');
interface TableContentInterface {
  [sem: string] : [
    {
      className: string;
      joinCode: string;
      students: [{
        name: string;
        address: string;
        grade?: string;
        txAddr?: string;
        classCode?: string;
      }]
    }
  ]
}


@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.scss']
})
export class InstructorComponent implements OnInit {

  web3: Web3 | undefined;

  public SEMESTERS = semesters;
  public currentUserAddr = '';

  constructor(
    private _db: Firestore,
    private _notification: NzNotificationService,
    private _msg: NzMessageService
  ) { }

  public selectedSemesterIdx = 0;
  public selectedClassIdx = 0;
  public tableContent: TableContentInterface = {};
  public contractInstance: Contract | undefined;
  blockView = environment.blockView;

  ngOnInit(): void {
    this.loadWeb3();
  }

  loadWeb3 = async () => {
    if (window.ethereum === undefined) {
      return;
    }
    await window.ethereum.request({method: 'eth_requestAccounts'});
    this.web3 = new Web3(window.ethereum);
    const accounts = await this.web3?.eth.getAccounts();
    // @ts-ignore
    if (accounts.length === 0) {
      return;
    }
    // @ts-ignore
    this.contractInstance = new this.web3.eth.Contract(abi, environment.contractAddress, {from: accounts[0]});
    // @ts-ignore
    this.currentUserAddr = accounts[0];
    this.loadClasses();
  }

  loadClasses = async () => {
    for (let i = 0; i < this.SEMESTERS.length; i++) {
      const semester = this.SEMESTERS[i];
      // @ts-ignore
      this.tableContent[semester.value] = [];
      const classesRef = collection(this._db, 'classes');
      const q = query(
        classesRef,
        where('semester', '==', semester.value),
        where('instructors', 'array-contains', this.currentUserAddr)
      );
      const docs = await getDocs(q);
      docs.forEach((doc) => {
        const data = doc.data();
        // @ts-ignore
        this.tableContent[semester.value].push({
          className: data['name'],
          joinCode: doc['id'],
          students: data['students'].map(async (student: string) => {
            const studentGrade = await getDocs(
              query(collection(this._db, 'grades'),
              where('student', '==', student),
              where('classCode', '==', doc['id'])));
            if (studentGrade.size === 0) {
              return {
                name: student,
                address: student,
                grade: null,
                txAddr: null,
                classCode: doc['id']
              }
            }
            const studentGradeData = studentGrade.docs[0].data();
            return {
              name: `${student}`,
              address: student,
              grade: studentGradeData['grade'],
              txAddr: studentGrade.docs[0]['id'],
              classCode: doc['id']
            }
          })
        });
      });
      await Promise.all(this.tableContent[semester.value].map(async (c) => {
        c.students = await Promise.all(c.students);
      }));
    }
    console.log(this.tableContent);
  }

  signGrade = async (addr: any, grade: any, classCode: any) => {
    const hashedURI = sha512(addr + '-' + grade + '-' + classCode);
    console.log(hashedURI);
    console.log(classCode);
    this._notification.info('Signing grade', 'Please wait on this page for the transaction to be mined and follow steps in Metamask.' +
      ' A new notification will appear when the transaction is complete.',
      {nzDuration: 5 * 1000});
    const ref = this._msg.loading('Signing grade', {nzDuration: 0});
    try{
      const result = await this.contractInstance?.methods.safeMint(addr, hashedURI).send({from: this.currentUserAddr});
      const tokenId = result.events.Transfer.returnValues.tokenId;
      const transactionHash = result.transactionHash;
      console.log(transactionHash);
      // store transactionHash in firebase
      const gradeRef = doc(this._db, 'grades', transactionHash);
      await setDoc(gradeRef, {
        semester: this.SEMESTERS[this.selectedSemesterIdx].value,
        class: this.tableContent[this.SEMESTERS[this.selectedSemesterIdx].value][this.selectedClassIdx].className,
        classCode: this.tableContent[this.SEMESTERS[this.selectedSemesterIdx].value][this.selectedClassIdx].joinCode,
        student: addr,
        grade: grade,
        instructor: this.currentUserAddr,
        tokenId
      });
      this._msg.remove(ref.messageId);
      this._notification.success('Grade signed', 'The grade has been signed and the token has been minted, token id is  ' + tokenId);
      this.loadClasses();
    } catch (e) {
      this._notification.error('Error', 'There was an error signing the grade. Please try again.');
      this._msg.remove(ref.messageId);
    }
  }
}

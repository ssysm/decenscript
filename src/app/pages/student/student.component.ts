import { Component, OnInit } from '@angular/core';
import semesters from "../../constants/semesters";
import {collection, Firestore, where, query, getDocs} from "@angular/fire/firestore";
import Web3 from "web3";
import {NzNotificationService} from "ng-zorro-antd/notification";

interface TableContentInterface {
  [key: string] : [{
    className: string;
    grade: string;
    blockId: string;
  }]
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  constructor(
    private _db: Firestore,
    private _notification: NzNotificationService,
  ) { }

  public isVisible = false;
  public joinCode = '';
  private web3: Web3 | undefined;
  public currentUserAddr = '';

  public tableData: TableContentInterface = {};

  public SEMESTER = semesters;

  ngOnInit(): void {
    this.loadWeb3();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  loadWeb3 = async () => {
    if (window.ethereum === undefined) {
      return;
    }
    await window.ethereum.request({method: 'eth_requestAccounts'});
    this.web3 = new Web3(window.ethereum);
    const accounts = await this.web3?.eth.getAccounts();
    if (accounts?.length === 0) {
      this._notification.error('Error', 'Please connect to MetaMask');
      return;
    }
    this.currentUserAddr = accounts[0];
    this.loadClasses();
  }

  loadClasses = async () => {
    // @ts-ignore
    for(let i = 0; i < this.SEMESTER.length; i++) {
      const semester = this.SEMESTER[i];
      const q = query(
        collection(this._db, 'classes'),
        where('semester', '==', semester.value),
        where('students', 'array-contains', this.currentUserAddr)
      );
      const querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        const data = doc.data();
        if(this.tableData[semester.value] === undefined) {
          this.tableData[semester.value] = [{
            className: data['name'],
            grade: 'N/A',
            blockId: 'N/A'
          }];
        }else {
          this.tableData[semester.value].push({
            className: data['name'],
            grade: 'A',
            blockId: '0x1234567890',
          });
        }
      });
      console.log();
    }
  }

}

import { Component, OnInit } from '@angular/core';
import {doc, Firestore, setDoc} from "@angular/fire/firestore";
import {Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";
import Web3 from "web3";
import { customAlphabet } from 'nanoid';
import semesters from "../../constants/semesters";
const nanoid = customAlphabet('1234567890ABCDEF', 10)

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss']
})
export class CreateClassComponent implements OnInit {

  constructor(
    private _router: Router,
    private _notification: NzNotificationService,
    private _db: Firestore
  ) { }
  web3: Web3 | undefined;

  className : string = '';
  semesterName : string = '';
  currentUserAddr = '';
  public SEMESTERS = semesters;

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
    if (accounts?.length === 0) {
      this._notification.error('Error', 'Please connect to MetaMask');
      return;
    }
    this.currentUserAddr = accounts[0];
  }

  handleCreate = async () => {
    // check inputs
    if(this.className === '' || this.semesterName === ''){
      this._notification.error('Error', 'Please fill all inputs');
      return;
    }
    // check if class exists
    const classRef = doc(this._db, 'classes', nanoid());
    // create class
    await setDoc(classRef, {
      name: this.className,
      semester: this.semesterName,
      instructors: [this.currentUserAddr],
      students: [],
    });
    this._notification.success('Success', 'Class created');
    this._router.navigate(['/instructor']);
  }

}


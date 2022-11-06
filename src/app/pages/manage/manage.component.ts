import { Component, OnInit } from '@angular/core';
import {collection, doc, Firestore, getDocs, query, updateDoc, where} from "@angular/fire/firestore";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzMessageService} from "ng-zorro-antd/message";
import Web3 from "web3";
import {environment} from "../../../environments/environment";
const abi = require('../../../assets/abi.json');

interface TableContentInterface {
  [role: string] : [{
    id: string;
    name: string;
  }]
}

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  constructor(
    private _db: Firestore,
    private _notification: NzNotificationService,
    private _msg: NzMessageService
  ) { }

  MINTER_ROLE_HASH = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6';

  studentName : string = '';
  studentAddr : string = '';
  instructorName: string = '';
  instructorAddr: string = '';

  public tableContent: TableContentInterface = {};

  web3: Web3 | undefined;
  contractInstance: any | undefined;

  loadWeb3 = async () => {
    if (window.ethereum === undefined) {
      this._notification.error('Error', 'Please install MetaMask');
      return;
    }
    const msgRef = this._msg.loading('Connecting to MetaMask', {nzDuration: 0});
    await window.ethereum.request({method: 'eth_requestAccounts'});
    this.web3 = new Web3(window.ethereum);
    const accounts = await this.web3?.eth.getAccounts();
    this._msg.remove(msgRef.messageId);
    // @ts-ignore
    if (accounts.length === 0) {
      this._notification.error('Error', 'Please connect to MetaMask');
      return;
    }
    const chainID = await this.web3?.eth.getChainId();
    if(chainID !== environment.chainID) {
      this._notification.error('Error', 'Please connect to Polygon Test Network (Mumbai)');
      return;
    }
    this.contractInstance = new this.web3.eth.Contract(abi, environment.contractAddress, {from: accounts[0]});
  }

  ngOnInit(): void {
    this.loadWeb3();
    this.loadUsers();
  }

  loadUsers = async ()=> {
    const msgRef = this._msg.loading('Loading users', {nzDuration: 0});
    const students = await getDocs(query(collection(this._db, 'users'),
      where('role', '==', 'student')));
    const instructors = await getDocs(query(collection(this._db, 'users'),
      where('role', '==', 'instructor')));
    this._msg.remove(msgRef.messageId);
    // @ts-ignore
    this.tableContent['student'] = students.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data()['name']
      }
    });
    // @ts-ignore
    this.tableContent['instructor'] = instructors.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data()['name']
      }
    });
    console.log(this.tableContent);
  };

  promoteUser = async (id: string) => {
    const msgRef = this._msg.loading('Promoting user', {nzDuration: 0});
    try{
      await this.contractInstance?.methods.grantRole(this.MINTER_ROLE_HASH, id).send();
      await updateDoc(doc(this._db, 'users', id), {role: 'instructor'});
      await this.loadUsers();
      this._notification.success('Success', 'User promoted to instructor');
      this._msg.remove(msgRef.messageId);
    } catch (e) {
      this._notification.error('Error', 'Something went wrong');
      console.error(e);
      this._msg.remove(msgRef.messageId);
    }
  }

  demoteUser = async (id: string) => {
    const msgRef = this._msg.loading('Demoting user', {nzDuration: 0});
    try{
      await this.contractInstance?.methods.revokeRole(this.MINTER_ROLE_HASH, id).send();
      await updateDoc(doc(this._db, 'users', id), {role: 'student'});
      await this.loadUsers();
      this._notification.success('Success', 'User demoted to student');
      this._msg.remove(msgRef.messageId);
    } catch (e) {
      this._notification.error('Error', 'Something went wrong');
      console.error(e);
      this._msg.remove(msgRef.messageId);
    }
  }

}

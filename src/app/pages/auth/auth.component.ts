import { Component, OnInit } from '@angular/core';
import {ContractService} from "../../services/contract.service";
import {Router} from "@angular/router";
import Web3 from "web3";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {collection, doc, Firestore, getDoc, setDoc} from "@angular/fire/firestore";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(
  private _contract: ContractService,
  private _router: Router,
  private _notification: NzNotificationService,
  private _db: Firestore
  ) { }

  web3: Web3 | undefined;

  ethEnabled = async () => {
    if (window.ethereum === undefined) {
      return false;
    }
    await window.ethereum.request({method: 'eth_requestAccounts'});
    this.web3 = new Web3(window.ethereum);
    return true;
  }

  ngOnInit(): void {
    this.ethEnabled().then((result) => {
    if (!result) {
      this._notification.error('Error', 'Please install MetaMask to use this app');
      return;
    }
    this.checkUser();
  });
  }

  checkUser = async () => {
    const accounts = await this.web3?.eth.getAccounts();
    if (accounts?.length === 0) {
      this._notification.error('Error', 'Please connect to MetaMask');
      return;
    }
    if(accounts === undefined) {
      return;
    }
    // @ts-ignore
    const user = await getDoc(doc(this._db, 'users', accounts[0]));
    const snapData = user.data();
    if(!user.exists()){
      this._notification.warning('Not registered!', 'You are not registered, creating account...');
      await setDoc(doc(this._db, 'users', accounts[0]), {
        role: 'student'
      });
      this._router.navigate(['/student']);
      return;
    }
    if(snapData === undefined) {
this._notification.error('Error', 'Please register first');
      return;
    }
    if (snapData['role'] === 'student') {
      this._router.navigate(['/student']);
    }else if(snapData['role'] === 'instructor') {
      this._router.navigate(['/instructor']);
    }else {
      this._notification.warning('Not registered!', 'You are not registered.');
    }
  }



}

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ContractService} from "../../services/contract.service";
import {Router} from "@angular/router";
import Web3 from "web3";
import {NzNotificationService} from "ng-zorro-antd/notification";
import { doc, Firestore, getDoc, setDoc} from "@angular/fire/firestore";
import {environment} from "../../../environments/environment";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit,AfterViewInit {

  constructor(
  private _contract: ContractService,
  private _router: Router,
  private _notification: NzNotificationService,
  private _msg: NzMessageService,
  private _db: Firestore
  ) { }

  web3: Web3 | undefined;
  isVisible = false;

  ngOnInit(): void {
  }

  checkUser = async () => {
    if (window.ethereum === undefined) {
      this._notification.error('Error', 'Please install MetaMask');
      return;
    }
    const msgRef = this._msg.loading('Logging you in', {nzDuration: 0});
    await window.ethereum.request({method: 'eth_requestAccounts'});
    this.web3 = new Web3(window.ethereum);
    const accounts = await this.web3?.eth.getAccounts();
    this._msg.remove(msgRef.messageId);
    if (accounts?.length === 0) {
      this._notification.error('Error', 'Please connect to MetaMask');
      return;
    }
    const chainID = await this.web3?.eth.getChainId();
    if(chainID !== environment.chainID) {
      this._notification.error('Error', 'Please connect to Polygon Test Network (Mumbai)');
      return;
    }
    // @ts-ignore
    const user = await getDoc(doc(this._db, 'users', accounts[0]));
    const snapData = user.data();
    if(!user.exists()){
      this._notification.warning('Not registered!', 'You are not registered, creating account...');
      // @ts-ignore
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

  ngAfterViewInit(): void {
    console.log(window.ethereum === undefined);
    if (window.ethereum === undefined) {
      this.showModal();
      return;
    }
    window.ethereum.request({method: 'eth_requestAccounts'});
  }

}

import {Component, OnInit} from '@angular/core';
import {Firestore} from "@angular/fire/firestore";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzMessageService} from "ng-zorro-antd/message";
import Web3 from "web3";
import {environment} from "../../../environments/environment";
import {Contract} from "web3-eth-contract";
import {sha512} from "js-sha512";

const abi = require('../../../assets/abi.json');

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  tokenID = '';
  verifyTargetAddress = '';
  letterGradeProvided = 'A';

  underVerify = false;
  isTokenOwner = false;
  tokenOwnerResult = '';
  isTokenHashValid = false;
  contractHashResult = '';
  inputHash = '';

  web3: Web3 | undefined;
  public contractInstance: Contract | undefined;

  constructor(
    private _db: Firestore,
    private _notification: NzNotificationService,
    private _msg: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.loadWeb3();
  }

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
    if (accounts?.length === 0) {
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

  verifyToken = async () =>{
    this.underVerify = false;
    this.isTokenOwner = false;
    this.tokenOwnerResult = '';
    this.isTokenHashValid = false;
    this.contractHashResult = '';
    this.inputHash = '';
    //check inputs
    if(this.tokenID === '' || this.verifyTargetAddress === ''){
      this._notification.error('Error', 'Please fill in all fields');
      return;
    }
    const hashedInput = sha512(this.verifyTargetAddress + '-' + this.letterGradeProvided);
    this.inputHash = hashedInput;
    const msgRef = this._msg.loading('Verifying token', {nzDuration: 0});
    this.tokenOwnerResult = await this.contractInstance?.methods.ownerOf(this.tokenID).call();
    if(this.tokenOwnerResult === this.verifyTargetAddress){
      this.isTokenOwner = true;
    }
    const uriResult = await this.contractInstance?.methods.tokenURI(this.tokenID).call();
    this.contractHashResult = uriResult.split('/')[4];
    if(this.contractHashResult === hashedInput){
      this.isTokenHashValid = true;
    }
    this.underVerify = true;
    this._msg.remove(msgRef.messageId);
    this._msg.success('Verification complete');
  }

}

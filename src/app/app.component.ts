import { Component } from '@angular/core';
import Web3 from 'web3';
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  web3: Web3 | undefined;

  constructor(
    private _msg: NzMessageService
  ) {
    this.loadWeb3();
  }

  loadWeb3 = async () => {
    if (window.ethereum === undefined) {
      return;
    }
    await window.ethereum.request({method: 'eth_requestAccounts'});
    this.web3 = new Web3(window.ethereum);
  }

  disconnect = async () => {
    this._msg.info('Please disconnect MetaMask and refresh the page');
  }

}

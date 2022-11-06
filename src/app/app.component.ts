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
  isLoggedIn = false;

  constructor(
    private _msg: NzMessageService
  ) {
    this.loadWeb3();
    this.isLoggedIn = (localStorage.getItem('user') !== null);
  }

  loadWeb3 = async () => {
    if (window.ethereum === undefined) {
      return;
    }
    await window.ethereum.request({method: 'eth_requestAccounts'});
    this.web3 = new Web3(window.ethereum);
  }

  disconnect = async () => {
    this.isLoggedIn = false;
    localStorage.removeItem('user');
  }

}

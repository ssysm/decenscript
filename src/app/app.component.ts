import { Component } from '@angular/core';
import Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  web3: Web3 | undefined;

  constructor() {
    this.loadWeb3();
  }

  loadWeb3 = async () => {
    if (window.ethereum === undefined) {
      return;
    }
    await window.ethereum.request({method: 'eth_requestAccounts'});
    this.web3 = new Web3(window.ethereum);
  }

  // disconnect = async () => {
  // }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  constructor() { }

  studentName : string = '';
  studentAddr : string = '';
  instructorName: string = '';
  instructorAddr: string = '';
  ngOnInit(): void {
  }

}

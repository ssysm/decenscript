import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss']
})
export class CreateClassComponent implements OnInit {

  constructor() { }

  className : string = '';
  semesterName : string = '';
  ngOnInit(): void {
  }

}


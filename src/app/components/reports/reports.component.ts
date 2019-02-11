import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] 
  yearArr = [];
  curYear = new Date().getFullYear();
  curMonth = new Date().toLocaleString('en-us', {month: 'short'});
  constructor() { }

  ngOnInit() {
    for(let i=this.curYear; i>1950; i--) {
      this.yearArr.push(i);
    }
  }

}

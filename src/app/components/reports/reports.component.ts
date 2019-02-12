import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  alertMsgFail: string;

  constructor(private router: Router) {}

  ngOnInit() {
    for(let i=this.curYear; i>1950; i--) {
      this.yearArr.push(i);
    }
  }

  getTaxReport(fmonth, fyear, tmonth, tyear) {
    this.alertMsgFail = null;
    
    if (fyear+fmonth/100 > tyear+tmonth/100) {
      this.alertMsgFail = "Start date cannot be greater than end date";
    } else if ((tyear-fyear)*12 + (tmonth - fmonth) > 11) {
      this.alertMsgFail = "Report cannot be generated for more than 12 months";
    } else {
      this.router.navigate(['/reports','tax'], {queryParams: {fyear: fyear, fmonth: fmonth, tyear: tyear, tmonth: tmonth}});
    }
  }

}

import { InfoService } from './../../../services/info.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css']
})
export class TaxComponent implements OnInit {
  fyear: number;
  fmonth: number;
  tyear: number;
  tmonth: number;
  fromDate: Date;
  toDate: Date;
  curYear = new Date().getFullYear();
  curMonth = new Date().getMonth()+1;
  taxReport: any;
  totalTax = 0;

  constructor(private router: Router, private route: ActivatedRoute, private infoService: InfoService) { }

  ngOnInit() {
    this.fyear = +this.route.snapshot.queryParamMap.get('fyear');
    this.fmonth = +this.route.snapshot.queryParamMap.get('fmonth');
    this.tyear = +this.route.snapshot.queryParamMap.get('tyear');
    this.tmonth = +this.route.snapshot.queryParamMap.get('tmonth');
    if ((!this.fyear || !this.fmonth || !this.tyear || !this.tmonth) ||
        (this.fyear+this.fmonth/100 > this.tyear+this.tmonth/100) || 
        ((this.tyear-this.fyear)*12 + (this.tmonth - this.fmonth) > 11) ||
        (this.tyear > this.curYear || (this.tyear === this.curYear && this.tmonth > this.curMonth))
        ) {
          this.router.navigate(['/reports']);
    }
    this.fromDate = new Date(this.fyear.toString()+'-'+this.fmonth.toString()+'-'+'01');
    this.toDate = new Date(this.tyear.toString()+'-'+this.tmonth.toString()+'-'+'01');
    this.infoService.getTaxReport(this.fyear, this.fmonth, this.tyear, this.tmonth)
    .subscribe( data => {
      this.taxReport = data;
      this.taxReport.forEach(taxdata => {
        this.totalTax += taxdata.taxamount;
      });
    });

  }

}

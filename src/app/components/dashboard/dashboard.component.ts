import { CompanyService } from './../../services/company.service';
import { Component, OnInit } from '@angular/core';
import { InfoService } from '../../services/info.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pendingData: any = {count:0, revenue: 0};
  completedData: any = {count:0, revenue: 0};
  supplierData : any = {count: 0};
  customerData : any = {count: 0};
  productCount = 0;

  constructor(private infoService: InfoService, private companyService: CompanyService) { }

  ngOnInit() {
    const curYear = new Date().getFullYear();
    const curMonth = new Date().getMonth()+1;
    this.infoService.getOrderInfo(curYear, curMonth)
    .subscribe( data => {
        this.pendingData = data[0] && data[0]._id === 'Pending' ? data[0] : data[1] ? data[1] : {count: 0};
        this.completedData = data[0] && data[0]._id === 'Completed' ? data[0] : data[1] ? data[1] : {count: 0};
    });

    this.infoService.getClientInfo()
    .subscribe( data => {
        this.supplierData = data[0] && data[0]._id === 'Supplier' ? data[0] : data[1] ? data[1] : 0;
        this.customerData = data[0] && data[0]._id === 'Customer' ? data[0] : data[1] ? data[1] : 0;
    });
    
    this.infoService.getProductInfo()
    .subscribe( data => {
        this.productCount = data['count'] ? data['count'] : 0;
    });

  }

}

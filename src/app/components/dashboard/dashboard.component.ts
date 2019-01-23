import { Component, OnInit } from '@angular/core';
import { InfoService } from '../../services/info.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pendingData = {};
  completedData = {};
  supplierData = 0;
  customerData = 0;
  productCount = 0;

  constructor(private infoService: InfoService) { }

  ngOnInit() {
    this.infoService.getOrderInfo()
    .subscribe( data => {
        this.pendingData = data[0] && data[0]._id === 'Pending' ? data[0] : data[1] ? data[1] : null;
        this.completedData = data[0] && data[0]._id === 'Completed' ? data[0] : data[1] ? data[1] : null;
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

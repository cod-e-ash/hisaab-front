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

  constructor(private infoService: InfoService) { }

  ngOnInit() {
    this.infoService.getOrderInfo()
    .subscribe( data => {
        this.pendingData = data[0] && data[0]._id === 'Pending' ? data[0] : data[1] ? data[1] : null;
        this.completedData = data[0] && data[0]._id === 'Completed' ? data[0] : data[1] ? data[1] : null;
    });
  }

}

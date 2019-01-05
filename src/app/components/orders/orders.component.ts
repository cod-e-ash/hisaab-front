import { Order } from './../../models/order.model';
import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[];
  curPage = 0;
  totalPages: number;
  totalRecs: number;
  navPages: number[];
  startPage = 0;
  endPage = 0;
  params: {};
  delOrderId: string;
  alertMsgSuccess: string;
  alertMsgFail: string;
  statusOpt: boolean;

  constructor(private router: Router, private route: ActivatedRoute , private dataservice: OrderService) { }

  ngOnInit() {
    this.statusOpt = true;
    this.route.queryParams
    .subscribe(params => {
      if (JSON.stringify(params) !== JSON.stringify(this.params)) {
        this.params = params;
        if (this.params['statusOpt'] === 'all') {
          this.statusOpt = false;
        }
        this.dataservice.getData(this.params)
        .subscribe(data => {
          if (this.totalRecs !== data.totalRecs) {
            this.endPage = 0;
          }
          this.orders = data.orders;
          this.curPage = data.curPage;
          this.totalPages = data.totalPages;
          this.totalRecs = data.totalRecs;
          this.pageLogic();
        }, error => {
          this.orders = [];
          this.curPage = 1;
          this.totalPages = 1;
          this.totalRecs = 0;
          this.pageLogic();
        }
        );
      }
    });
  }

  pageLogic() {
    if (this.curPage < this.startPage && this.curPage >= 0) {
      this.navPages = [];
      this.startPage = this.curPage - 4 > 0 ? this.curPage - 4 : 1;
      this.endPage = this.startPage + 4 > this.totalPages ? this.totalPages : this.startPage + 4;
      for (let i = this.startPage ; i <= this.endPage ; i++) {
        this.navPages.push(i);
      }
    }

    if (this.curPage > this.endPage && this.curPage <= this.totalPages) {
      this.navPages = [];
      this.endPage = this.curPage + 4 > this.totalPages ? this.totalPages : this.curPage + 4;
      this.startPage = this.endPage - 4 > 0 ? this.endPage - 4 : 1;
      for (let i = this.startPage ; i <= this.endPage ; i++) {
        this.navPages.push(i);
      }
    }
  }

  searchParamChange(newParam) {
    if (newParam.statusOpt === false && (!newParam.client || !newParam.code)) {
      newParam.statusOpt = 'all';
    } else if (newParam.statusOpt === true && (!newParam.client || !newParam.code)) {
      newParam.statusOpt = null;
    }
    this.router.navigate(['/orders'], {queryParams: {...newParam}, queryParamsHandling: 'merge'});
  }

  deleteOrder() {
    this.alertMsgSuccess = null;
    this.alertMsgFail = null;
    if (this.delOrderId) {
      this.dataservice.deleteData(this.delOrderId)
      .subscribe(data => {
          if (!data.error) {
            const index = this.getOrderIndex(this.delOrderId);
            if (index >= 0) {
              this.orders.splice(index, 1);
              this.alertMsgSuccess = 'Order deleted successfully';
              this.delOrderId = null;
            }
          } else {
            this.alertMsgFail = 'Order not deleted.' + data.error;
          }
      }, error => {
          this.alertMsgFail = 'Order not deleted. Server Error!';
      });
    }
  }

  getOrderIndex(id: string) {
    return this.orders.findIndex(order => {
      return order['_id'] === id;
    });
  }
}

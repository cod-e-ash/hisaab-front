import { TaxRateService } from './../../services/taxrate.service';
import { Subscription } from 'rxjs';
import { Order } from './../../models/order.model';
import { OrderService } from './../../services/order.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[];
  curPage = 0;
  totalPages: number;
  totalRecs: number;
  navPages: number[];
  startPage = 0;
  endPage = 0;
  params: {};
  curOrder: Order;
  alertMsgSuccess: string;
  alertMsgFail: string;
  statusOpt: boolean;
  dataSubs: Subscription;
  isLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataservice: OrderService,
    private taxRateService: TaxRateService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    // Show only in stok product by default
    this.statusOpt = true;
    this.taxRateService.getTaxes();
    // Subscribe to query param changes
    this.route.queryParamMap.subscribe(params => {
      const newparams = {};
      params.keys.forEach(key => {
        newparams[key] = params.get(key);
      });
      // Compare old and new params, so that page is not reloaded if no changes
      if (JSON.stringify(newparams) !== JSON.stringify(this.params)) {
        this.params = newparams;
        // Set stock option to false if all passed
        if (this.params['statusOpt'] === 'all') {
          this.statusOpt = false;
        }
        // Get data from data service by passing the params
        this.dataSubs = this.dataservice.getData(this.params).subscribe(
          data => {
            // Copy new values if records or number of pages change
            if (this.totalRecs !== data.totalRecs || this.totalPages !== data.totalPages) {
              this.endPage = 0;
            }
            this.orders = data.orders;
            this.curPage = data.curPage;
            this.totalPages = data.totalPages;
            this.totalRecs = data.totalRecs;
            // Execute pagination logic
            this.pageLogic();
            this.isLoading = false;
          },
          error => {
            // Set all fields to default if no records found or server error
            this.orders = [];
            this.curPage = 1;
            this.totalPages = 1;
            this.totalRecs = 0;
            this.pageLogic();
            this.isLoading = false;
          }
        );
      }
    });
  }

  searchParamChange(newParam) {
    if (newParam.fromDate || newParam.toDate) {
      if (newParam.fromDate.value !== '') {
        newParam.fromDate = newParam.fromDate.value;
      } else {
        newParam.fromDate = null;
      }

      if (newParam.toDate.value !== '') {
        newParam.toDate = newParam.toDate.value;
      } else {
        newParam.toDate = null;
      }
    }

    if (newParam.statusOpt === false && (!newParam.client || !newParam.orderno)) {
      newParam.statusOpt = 'all';
    } else if (newParam.statusOpt === true && (!newParam.client || !newParam.orderno)) {
      newParam.statusOpt = null;
    }
    this.router.navigate(['/orders'], {
      queryParams: { ...newParam },
      queryParamsHandling: 'merge'
    });
  }

  pageLogic() {
    // If previous page requested is less than first page link and not zero
    if (this.curPage < this.startPage && this.curPage >= 0) {
      // Clear page array and fill with only 5 pages or total pages in case less that 5 pages
      this.navPages = [];
      this.startPage = this.curPage - 4 > 0 ? this.curPage - 4 : 1;
      this.endPage = this.startPage + 4 > this.totalPages ? this.totalPages : this.startPage + 4;
      for (let i = this.startPage; i <= this.endPage; i++) {
        this.navPages.push(i);
      }
    }

    // If next page requested is greater than last page link and not the last page
    if (this.curPage > this.endPage && this.curPage <= this.totalPages) {
      this.navPages = [];
      this.endPage = this.curPage + 4 > this.totalPages ? this.totalPages : this.curPage + 4;
      this.startPage = this.endPage - 4 > 0 ? this.endPage - 4 : 1;
      for (let i = this.startPage; i <= this.endPage; i++) {
        this.navPages.push(i);
      }
    }
  }

  deleteOrder() {
    this.alertMsgSuccess = null;
    this.alertMsgFail = null;
    if (this.curOrder) {
      this.dataservice.deleteData(this.curOrder._id).subscribe(
        data => {
          if (!data.error) {
            const index = this.getOrderIndex(this.curOrder._id);
            if (index >= 0) {
              this.orders.splice(index, 1);
              this.totalRecs -= this.totalRecs > 1 ? 1 : 0;
              this.alertMsgSuccess = 'Order deleted successfully';
              this.curOrder = null;
            }
          } else {
            this.alertMsgFail = 'Order not deleted.' + data.error;
          }
        },
        error => {
          this.alertMsgFail = 'Order not deleted. Server Error!';
        }
      );
    }
  }

  changeOrderStatus() {
    this.alertMsgSuccess = null;
    this.alertMsgFail = null;
    if (this.curOrder) {
      this.curOrder.status = 'Completed';
      this.dataservice.updateData(this.curOrder).subscribe(
        data => {
          if (data) {
            const index = this.getOrderIndex(this.curOrder._id);
            if (index >= 0) {
              if (this.statusOpt) {
                this.orders.splice(index, 1);
              } else {
                this.orders[index].status = 'Completed';
              }
              this.alertMsgSuccess = 'Order updated successfully';
              this.curOrder = null;
            } else {
              this.orders[index].status = 'Pending';
              this.alertMsgFail = 'Order not updated.';
            } 
          } else {
            this.alertMsgFail = 'Order not updated.';
          }
        },
        error => {
          this.alertMsgFail = 'Order not updated. Server Error!';
        }
      );
    }
  }

  getOrderIndex(id: string) {
    return this.orders.findIndex(order => {
      return order['_id'] === id;
    });
  }

  ngOnDestroy() {
    this.dataSubs.unsubscribe();
  }
}

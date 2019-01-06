import { Customer } from '../../models/customer.model';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[];
  curPage = 0;
  totalPages: number;
  totalRecs: number;
  navPages: number[];
  startPage = 0;
  endPage = 0;
  params: {};
  delCustomerId: string;
  delCustomerName: string;
  alertMsgSuccess: string;
  alertMsgFail: string;
  type: string;


  constructor(private router: Router, private route: ActivatedRoute , private dataservice: CustomerService) { }

  ngOnInit() {
    combineLatest( this.route.params, this.route.queryParams, (params, qparams) => ({
      params, qparams
    }))
    .subscribe( allParams => {
      if (!this.type || this.type.toLowerCase() + 's' !== allParams.params['type']) {
        this.type = allParams.params['type'] === 'customers' ? 'Customer' : 'Supplier';
        this.params = null;
        this.router.navigate(['/clients', this.type.toLowerCase() + 's'], 
        {queryParams: {page: null, name: null}, queryParamsHandling: 'merge'});
      } else if (!this.params || JSON.stringify(allParams.qparams) !== JSON.stringify(this.params)) {
          this.params = allParams.qparams;
      }
      this.dataservice.getData(this.params, this.type)
      .subscribe(data => {
        if (this.totalRecs !== data.totalRecs) {
          this.endPage = 0;
        }
        this.customers = data.customers;
        this.curPage = data.curPage;
        this.totalPages = data.totalPages;
        this.totalRecs = data.totalRecs;
        this.pageLogic();
      }, error => {
        this.customers = [];
        this.curPage = 1;
        this.totalPages = 1;
        this.totalRecs = 0;
        this.pageLogic();
      });
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
    if (!newParam.name) {
      newParam.name = null;
    }
    this.router.navigate(['/clients', this.type.toLowerCase() + 's'], {queryParams: {...newParam}, queryParamsHandling: 'merge'});
  }

  deleteCustomer() {
    this.alertMsgSuccess = null;
    this.alertMsgFail = null;
    if (this.delCustomerId) {
      this.dataservice.deleteData(this.delCustomerId)
      .subscribe(data => {
          if (!data.error) {
            const index = this.getCustomerIndex(this.delCustomerId);
            if (index >= 0) {
              this.customers.splice(index, 1);
              this.totalRecs -= this.totalRecs > 1 ? 1 : 0;
              this.alertMsgSuccess = 'Customer deleted successfully';
              this.delCustomerId = null;
              this.delCustomerName = null;
            }
          } else {
            this.alertMsgFail = 'Customer not deleted.' + data.error;
          }
      }, error => {
          this.alertMsgFail = 'Customer not deleted. Server Error!';
      });
    }
  }

  getCustomerIndex(id: string) {
    return this.customers.findIndex(customer => {
      return customer['_id'] === id;
    });
  }
}

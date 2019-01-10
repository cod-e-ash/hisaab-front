import { Customer } from '../../models/customer.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit, OnDestroy {
  customers: Customer[];
  curPage = 0;
  totalPages: number;
  totalRecs: number;
  navPages: number[];
  startPage = 0;
  endPage = 0;
  qParams: {} = {
    page: null,
    name: null
  };
  delCustomerId: string;
  delCustomerName: string;
  alertMsgSuccess: string;
  alertMsgFail: string;
  type: string;
  latestParams: Observable<any>;
  combSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataservice: CustomerService
  ) {}

  ngOnInit() {
    // Combine route and query params
    // Distinct will check for distinct parameter
    // debounce will wait untill stack request are cleared
    this.latestParams = combineLatest(this.route.queryParamMap, this.route.paramMap).pipe(
      debounceTime(0),
      distinctUntilChanged(),
      map(data => ({
        qParams: data[0],
        params: data[1]
      }))
    );
    // Subscribe to navigation or query parameter changes
    this.combSub = this.latestParams.subscribe(allParams => {
      let wChange = false;
      const newQParams = {};

      // Copy query parameters to new object
      if (allParams.qParams.keys.length > 0) {
        allParams.qParams.keys.forEach(key => {
          newQParams[key] = allParams.qParams.get(key);
        });
      }

      // If already on customer page and customer type changed (customer/supplier)
      // (clear query parameter in this case)
      if (this.type && this.type.toLowerCase() + 's' !== allParams.params.get('type')) {
        this.qParams = null;
        wChange = true;
      } else if (
        !this.type ||
        !this.qParams ||
        JSON.stringify(newQParams) !== JSON.stringify(this.qParams)
      ) {
        // If new query params are different from old query params
        this.qParams = newQParams;
        wChange = true;
      }

      // Update customer type
      this.type = allParams.params.get('type') === 'customers' ? 'Customer' : 'Supplier';

      // Get data
      if (wChange) {
        this.dataservice.getData(this.qParams, this.type).subscribe(
          data => {
            // If change in data
            if (this.totalRecs !== data.totalRecs || this.totalPages !== data.totalPages) {
              this.endPage = 0;
            }
            this.customers = data.customers;
            this.curPage = data.curPage;
            this.totalPages = data.totalPages;
            this.totalRecs = data.totalRecs;
            this.pageLogic();
          },
          error => {
            this.customers = [];
            this.curPage = 1;
            this.totalPages = 1;
            this.totalRecs = 0;
            this.pageLogic();
          }
        );
      }
    });
  }

  searchParamChange(newParam) {
    if (!newParam.name) {
      newParam.name = null;
    }
    this.router.navigate(['/clients', this.type.toLowerCase() + 's'], {
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

  deleteCustomer() {
    this.alertMsgSuccess = null;
    this.alertMsgFail = null;
    if (this.delCustomerId) {
      this.dataservice.deleteData(this.delCustomerId).subscribe(
        data => {
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
        },
        error => {
          this.alertMsgFail = 'Customer not deleted. Server Error!';
        }
      );
    }
  }

  getCustomerIndex(id: string) {
    return this.customers.findIndex(customer => {
      return customer['_id'] === id;
    });
  }

  ngOnDestroy() {
    this.combSub.unsubscribe();
  }
}

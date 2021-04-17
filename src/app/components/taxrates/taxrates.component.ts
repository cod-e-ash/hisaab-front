import { TaxRate } from './../../models/taxrate.model';
import { TaxRateService } from 'src/app/services/taxrate.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-taxrates',
  templateUrl: './taxrates.component.html',
  styleUrls: ['./taxrates.component.css']
})
export class TaxRatesComponent implements OnInit, OnDestroy {
  taxRates: TaxRate[];
  curPage = 0;
  totalPages: number;
  totalRecs: number;
  navPages: number[];
  startPage = 0;
  endPage = 0;
  params: any;
  curTaxRate: TaxRate;
  alertMsgSuccess: string;
  alertMsgFail: string;
  stockOpt: boolean;
  dataSubs: Subscription;
  isLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataservice: TaxRateService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    // Show only in stok product by default
    this.stockOpt = true;

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
        // Get data from data service by passing the params
        this.dataSubs = this.dataservice.getData(this.params).subscribe(
          data => {
            // Copy new values if records or number of pages change
            if (this.totalRecs !== data.totalRecs || this.totalPages !== data.totalPages) {
              this.endPage = 0;
            }
            this.taxRates = data.taxRates;
            this.curPage = data.curPage;
            this.totalPages = data.totalPages;
            this.totalRecs = data.totalRecs;
            // Execute pagination logic
            this.pageLogic();
            this.isLoading = false;
          },
          error => {
            // Set all fields to default if no records found or server error
            this.taxRates = [];
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

  searchParamChange(newParam) {
    // Stock option changed
    if (newParam.stockOpt === false && (!newParam.company || !newParam.name)) {
      newParam.stockOpt = 'all';
    } else if (newParam.stockOpt === true && (!newParam.company || !newParam.name)) {
      newParam.stockOpt = null;
    }
    this.router.navigate(['/taxrates'], {
      queryParams: { ...newParam },
      queryParamsHandling: 'merge'
    });
  }

  deleteProduct() {
    this.alertMsgSuccess = null;
    this.alertMsgFail = null;
    if (this.curTaxRate.name) {
      this.dataservice.deleteData(this.curTaxRate.name).subscribe(
        data => {
          if (!data.error) {
            const index = this.getProductIndex(this.curTaxRate.name);
            if (index >= 0) {
              this.taxRates.splice(index, 1);
              this.totalRecs -= this.totalRecs > 1 ? 1 : 0;
              this.alertMsgSuccess = 'Product deleted successfully';
              this.curTaxRate = null;
            }
          } else {
            this.alertMsgFail = 'Product not deleted.' + data.error;
          }
        },
        error => {
          this.alertMsgFail = 'Product not deleted. Server Error!';
        }
      );
    }
  }


  getProductIndex(name: string) {
    return this.taxRates.findIndex(product => {
      return product['name'] === name;
    });
  }

  ngOnDestroy() {
    this.dataSubs.unsubscribe();
  }
}

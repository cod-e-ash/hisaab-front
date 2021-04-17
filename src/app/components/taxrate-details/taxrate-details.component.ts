import { TaxRateService } from 'src/app/services/taxrate.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-taxrate-details',
  templateUrl: './taxrate-details.component.html',
  styleUrls: ['./taxrate-details.component.css']
})
export class TaxRateDetailsComponent implements OnInit {
  taxRate: any = {};
  mode: string;
  messageSuccess: string;
  messageFail: string;
  prvParams = {};

  constructor(
    private route: ActivatedRoute,
    private dataService: TaxRateService,
    private router: Router
  ) {}

  ngOnInit() {
    // Store mode new/edit/display
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.route.queryParamMap.subscribe(params => {
      this.prvParams = {
        name: params.get('name')
      };
      this.prvParams['name'] = null;
      if (this.mode === 'edit' || this.mode === 'display') {
        this.taxRate = this.dataService.getTaxRate(params.get('name'));
        if (!this.taxRate) {
          this.router.navigate(['/taxRates'], {
            queryParams: this.prvParams
          });
        }
      } else {
        this.taxRate.stock = 0;
      }
    });
  }

  savetaxRate(taxRate: NgForm) {
    this.messageFail = null;
    this.messageSuccess = null;
    if (!taxRate.valid) {
      this.messageFail = 'Invalid Entries in Form';
    } else {
      if (this.mode === 'new') {
        this.dataService.createData(taxRate.value).subscribe(data => {
          taxRate.reset();
          this.messageSuccess = 'Record Added Successfully';
        });
      } else {
        this.dataService.updateData(this.taxRate).subscribe(data => {
          this.messageSuccess = 'Record Updated Successfully';
        });
      }
    }
  }

  changeStockQty(opr, pqty) {
    if (pqty && pqty > 0) {
      if (opr === 'add') {
        this.taxRate.stock += pqty;
      } else {
        this.taxRate.stock -= pqty;
      }
    }
  }
}

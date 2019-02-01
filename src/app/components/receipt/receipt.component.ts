import { TaxRateService } from './../../services/taxrate.service';
import { NewOrderService } from './../../services/neworder.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {

  curOrder = {};
  allTaxRates = [];
  allTaxAmounts = {};

  constructor(
    private newOrderService: NewOrderService, 
    private route: ActivatedRoute, 
    private router: Router,
    private taxRateService: TaxRateService
    ) { }

  ngOnInit() {
    // Store mode new/edit/display
    this.route.queryParamMap.subscribe(params => {
      this.curOrder = this.newOrderService.curOrder;
      if (!this.curOrder) {
        this.router.navigate(['/orders']);
      }
      this.allTaxRates = this.newOrderService.alltaxrates.sort();
      this.allTaxAmounts = this.newOrderService.alltaxamounts;
    });
  }

  getTaxRate(rate) {
    return this.taxRateService.getTaxRate(rate);
  }

}

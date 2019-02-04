import { CompanyService } from './../../services/company.service';
import { Order } from './../../models/order.model';
import { Company } from './../../models/company.model';
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

  curOrder: Order;
  allTaxRates = [];
  allTaxAmounts = {};
  company: Company;

  constructor(
    private newOrderService: NewOrderService, 
    private route: ActivatedRoute, 
    private router: Router,
    private taxRateService: TaxRateService,
    private companyService: CompanyService
    ) { }

  ngOnInit() {
    // Store mode new/edit/display
    if (!this.companyService.company || !this.companyService.company.name) {
      this.router.navigate(['/settings']);
    } else {
      this.company = this.companyService.company;
    }

    this.route.queryParamMap.subscribe(params => {
      this.curOrder = this.newOrderService.curOrder;
      if (!this.curOrder || this.curOrder.details.length === 0) {
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

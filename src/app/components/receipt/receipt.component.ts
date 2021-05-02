import { UtilityService } from './../../services/utility.service';
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
  recsPerPage = 12;
  pages = [];
  pageStart= [];
  recsDone = 0;

  constructor(
    private newOrderService: NewOrderService, 
    private route: ActivatedRoute, 
    private router: Router,
    private taxRateService: TaxRateService,
    private companyService: CompanyService,
    private utilityService: UtilityService
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
      if (this.curOrder) {
        this.pageLogic(this.curOrder.details.length);
      }
    });
  }

  getTaxRate(rate: string): number {
    return this.taxRateService.getTaxRate(rate)?.rate ?? 0;
  }

  pageLogic(noOfRecs) {
    let prvsDone = 0;
    this.pages = [];
    this.pageStart = [];
    while(noOfRecs > 12){
      if(noOfRecs > 20) {
        this.pages.push(20);
        this.pageStart.push(prvsDone);
        noOfRecs -= 20;
        prvsDone += 20;
      } else if (noOfRecs > 12){
        this.pageStart.push(prvsDone);
        prvsDone += noOfRecs-1;
        this.pages.push(noOfRecs-1);
        noOfRecs = 1;
      }
    }
    this.pageStart.push(prvsDone);
    this.pages.push(noOfRecs);
  }

  public getAmountInWords = () =>
  {
    return this.utilityService.toWords(this.curOrder.finalamount);
  }
}

import { TaxRateService } from './../../services/taxrate.service';
import { Subscription } from 'rxjs';
import { CompanyService } from './../../services/company.service';
import { Company } from './../../models/company.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  curView: string;
  company: Company = {};
  companyListner: Subscription;

  constructor(
    private router: Router, 
    private companyService: CompanyService, 
    private taxRateService: TaxRateService
    ) {}

  ngOnInit() {
    this.taxRateService.getTaxes();
    this.companyService.getCompanyFromServer();
    this.companyListner = this.companyService.getCompanyListner()
      .subscribe(data => {
        if (data) {
          this.company = data;
        }
    });
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (this.router.parseUrl(val.url).root.children.primary) {
          const segments = this.router.parseUrl(val.url).root.children.primary.segments;
          if (segments && segments.length > 0) {
            if (segments[0].path && segments[0].path === 'products') {
              this.curView = segments[0].path;
            } else if (segments.length > 2) {
              this.curView = segments[segments.length - 2].path;
            } else {
              this.curView = segments[segments.length - 1].path;
            }
          }
        }
      }
    });
    
  }

  ngOnDestroy() {
    // try {
    //   this.companyListner.unsubscribe();
    // } catch {}
  }
}


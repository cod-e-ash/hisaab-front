import { Subscription } from 'rxjs';
import { CompanyService } from './../../services/company.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, OnDestroy {
  company: Company = {};
  mode: string;
  messageSuccess: string;
  messageFail: string;
  companyListner: Subscription;

  constructor(
    private route: ActivatedRoute,
    private dataService: CompanyService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get company type
    // Get Mode (New/Edit/Display)
    this.messageFail = null;
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.route.paramMap.subscribe(params => {
        this.mode = params.get('mode');
        if (!this.dataService.company || !this.dataService.company.name) {
          this.dataService.getCompanyFromServer();
        } else {
          Object.assign(this.company, this.dataService.company);
        }
        this.companyListner = this.dataService.getCompanyListner().subscribe(data => {
          if (data) {
              this.company = data;
          }
        });
        if (!this.company) {
          if (this.mode === 'display') {
            this.router.navigate(['/settings', 'edit']);
          } else {
            this.messageFail = 'Please add company details!';
          }
        }
    });
  }

  saveCompany(company: NgForm) {
    this.messageFail = null;
    this.messageSuccess = null;
    if (!company.valid) {
      this.messageFail = 'Invalid Entries in Form';
    } else {
        this.dataService.setCompany(company.value).subscribe(data => {
          this.messageSuccess = 'Record Updated Successfully';
        });
      }
  }

  ngOnDestroy() {
    this.companyListner.unsubscribe();
  }

}

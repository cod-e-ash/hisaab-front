import { CompanyService } from './../../services/company.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  company: any = {};
  mode: string;
  messageSuccess: string;
  messageFail: string;

  constructor(
    private route: ActivatedRoute,
    private dataService: CompanyService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get company type
    // Get Mode (New/Edit/Display)
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.route.paramMap.subscribe(params => {
      if (params['mode'] !== this.mode) {
        this.mode 
      }
      if (this.mode === 'edit' || this.mode === 'display') {
        this.company = this.dataService.getCompany();
        if (!this.company) {
          this.router.navigate(['/settings', 'edit']);
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
      if (this.mode === 'new') {
        company.value['type'] = this.ctype;
        this.dataService.setCompany(company.value).subscribe(data => {
          this.messageSuccess = 'Record Added Successfully';
        });
      } else {
        this.dataService.setCompany(this.company).subscribe(data => {
          this.messageSuccess = 'Record Updated Successfully';
        });
      }
    }
  }
}

import { CustomerService } from './../../services/customer.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  customer: any = {};
  paramtype: string;
  ctype: string;
  mode: string;
  messageSuccess: string;
  messageFail: string;
  prvParams = {};

  constructor(
    private route: ActivatedRoute,
    private dataService: CustomerService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get customer type
    this.paramtype = this.route.snapshot.paramMap.get('type');
    this.ctype = this.paramtype === 'customers' ? 'Customer' : 'Supplier';
    // Get Mode (New/Edit/Display)
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.route.queryParamMap.subscribe(params => {
      params.keys.forEach(key => {
        this.prvParams[key] = params.get(key);
      });
      this.prvParams['id'] = null;
      if (this.mode === 'edit' || this.mode === 'display') {
        this.customer = this.dataService.getSingle(params.get('id'));
        if (!this.customer) {
          this.router.navigate(['/clients', this.paramtype], {
            queryParams: this.prvParams
          });
        }
      }
    });
  }

  saveCustomer(customer: NgForm) {
    this.messageFail = null;
    this.messageSuccess = null;
    if (!customer.valid) {
      this.messageFail = 'Invalid Entries in Form';
    } else {
      if (this.mode === 'new') {
        customer.value['type'] = this.ctype;
        this.dataService.createData(customer.value).subscribe(data => {
          customer.reset();
          this.messageSuccess = 'Record Added Successfully';
        });
      } else {
        this.dataService.updateData(this.customer).subscribe(data => {
          this.messageSuccess = 'Record Updated Successfully';
        });
      }
    }
  }
}

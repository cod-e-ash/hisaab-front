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
  type: string;
  messageSuccess: string;
  messageFail: string;
  prvParams = {};

  constructor(private route: ActivatedRoute, private dataService: CustomerService, private router: Router) { }

  ngOnInit() {
    this.paramtype = this.route.snapshot.params['type'];
    if (this.paramtype === 'customers') {
      this.ctype = 'Customer';
    } else {
      this.ctype = 'Supplier';
    }
    this.type = this.route.snapshot.params['option'];
    this.route.queryParams
    .subscribe(params => {
      this.prvParams = {...params};
      this.prvParams['id'] = null;
      if (this.type === 'edit' || this.type === 'display') {
        this.customer = this.dataService.getSingle(params.id);
        if (!this.customer) {
          this.router.navigate(['/clients', this.paramtype], {queryParams: this.prvParams});
        }
      } else {
        this.customer.stock = 0;
      }
    });
  }

  saveProduct(customer: NgForm) {
    this.messageFail = null;
    this.messageSuccess = null;
    if (!customer.valid) {
      this.messageFail = 'Invalid Entries in Form';
    } else {
      if (this.type === 'new') {
        this.dataService.createData(customer.value)
        .subscribe( data => {
          customer.reset();
          this.messageSuccess = 'Record Added Successfully';
        });
      } else {
        this.dataService.updateData(this.customer)
        .subscribe( data => {
          this.messageSuccess = 'Record Updated Successfully';
        });
      }
    }
  }

}


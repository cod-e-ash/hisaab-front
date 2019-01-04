import { Product } from './../../models/product.model';
import { ProductService } from './../../services/product.service';
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any = {};
  type: string;
  messageSuccess: string;
  messageFail: string;
  prvParams = {};

  constructor(private route: ActivatedRoute, private dataService: ProductService, private router: Router) { }

  ngOnInit() {
    this.type = this.route.snapshot.params['option'];
    this.route.queryParams
    .subscribe(params => {
      this.prvParams = {...params};
      this.prvParams['id'] = null;
      if (this.type === 'edit' || this.type === 'display') {
        this.product = this.dataService.getSingle(params.id);
        if (!this.product) {
          this.router.navigate(['/products'], {queryParams: this.prvParams});
        }
      } else {
        this.product.stock = 0;
      }
    });
  }

  saveProduct(product: NgForm) {
    this.messageFail = null;
    this.messageSuccess = null;
    if (!product.valid) {
      this.messageFail = 'Invalid Entries in Form';
    } else{
      if (this.type === 'new') {
        this.dataService.createData(product.value)
        .subscribe( data => {
          product.reset();
          this.messageSuccess = 'Record Added Successfully';
        });
      } else {
        this.dataService.updateData(this.product)
        .subscribe( data => {
          this.messageSuccess = 'Record Updated Successfully';
        });
      }
    }
  }

  changeStockQty(opr, pqty) {
    if (pqty && pqty > 0) {
      if (opr === 'add') {
        this.product.stock += pqty;
      } else {
        this.product.stock -= pqty;
      }
    }
  }

}

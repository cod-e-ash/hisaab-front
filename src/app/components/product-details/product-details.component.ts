import { Product } from './../../models/product.model';
import { ProductService } from './../../services/product.service';
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any = {};
  type: string;
  message = '';

  constructor(private route: ActivatedRoute, private dataService: ProductService, private router: Router) { }

  ngOnInit() {
    this.type = this.route.snapshot.params['option'];
    this.route.queryParams
    .subscribe(params => {
      if (this.type === 'edit') {
        this.product = this.dataService.getSingle(params.id);
        if (!this.product) {
          this.router.navigate(['/products']);
        }
      }
    });
  }

  fsubmit(product) {
    if (product.valid) {
      if (this.type === 'new') {
        this.dataService.createData(product.value)
        .subscribe( data => {
          this.router.navigate(['products']);
        });
      } else {
        this.dataService.updateData(this.product)
        .subscribe( data => {
          this.message = 'Record Updated Successfully';
        });
      }
    }
  }

}

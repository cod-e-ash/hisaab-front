import { ProductService } from './../../services/product.service';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private dataService: ProductService, private router: Router) { }

  ngOnInit() {
  }

  fsubmit(product) {
    if (product.valid) {
      console.log(product.value);
      this.dataService.createData(product.value)
      .subscribe( data => {
        this.router.navigate(['products']);
      });
    }
  }

}

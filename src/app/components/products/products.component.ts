import { Product } from './../../models/product.model';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[];

  constructor(private dataservice: ProductService) { }

  ngOnInit() {
    this.dataservice.getData()
    .subscribe( data => {
      this.products = data;
    });
  }


}

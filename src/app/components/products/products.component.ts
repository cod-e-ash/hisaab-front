import { NavbarComponent } from './../navbar/navbar.component';
import { Product } from './../../models/product.model';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[];
  curPage = 0;
  totalPages: number;
  totalRecs: number;
  navPages: number[];
  startPage = 0;
  endPage = 0;
  params: {};

  constructor(private router: Router, private route: ActivatedRoute , private dataservice: ProductService) { }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      if (JSON.stringify(params) !== JSON.stringify(this.params)) {
        this.params = params;
        this.dataservice.getData(this.params)
        .subscribe(data => {
          if (this.totalRecs !== data.totalRecs) {
            this.endPage = 0;
          }
          this.products = data.products;
          this.curPage = data.curPage;
          this.totalPages = data.totalPages;
          this.totalRecs = data.totalRecs;
          this.pageLogic();
        }, error => {
          this.products = [];
          this.curPage = 1;
          this.totalPages = 1;
          this.totalRecs = 0;
          this.pageLogic();
        }
        );
      }
    });
  }

  pageLogic() {
    if (this.curPage < this.startPage && this.curPage >= 0) {
      this.navPages = [];
      this.startPage = this.curPage - 4 > 0 ? this.curPage - 4 : 1;
      this.endPage = this.startPage + 4 > this.totalPages ? this.totalPages : this.startPage + 4;
      for (let i = this.startPage ; i <= this.endPage ; i++) {
        this.navPages.push(i);
      }
    }

    if (this.curPage > this.endPage && this.curPage <= this.totalPages) {
      this.navPages = [];
      this.endPage = this.curPage + 4 > this.totalPages ? this.totalPages : this.curPage + 4;
      this.startPage = this.endPage - 4 > 0 ? this.endPage - 4 : 1;
      for (let i = this.startPage ; i <= this.endPage ; i++) {
        this.navPages.push(i);
      }
    }
  }

  searchParamChange(newParam) {
    if (newParam.active === false) {
      newParam.active = null;
    }
    this.router.navigate(['/products'], {queryParams: {...newParam}, queryParamsHandling: 'merge'});
  }

}

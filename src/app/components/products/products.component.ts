import { Product } from './../../models/product.model';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  delProductId: string;
  delProductName: string;
  alertMsgSuccess: string;
  alertMsgFail: string;

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
    if (newParam.active === true) {
      newParam.active = null;
    } else {
      newParam.active = 'all';
    }
    this.router.navigate(['/products'], {queryParams: {...newParam}, queryParamsHandling: 'merge'});
  }

  deleteProduct() {
    this.alertMsgSuccess = null;
    this.alertMsgFail = null;
    if (this.delProductId) {
      this.dataservice.deleteData(this.delProductId)
      .subscribe(data => {
          if (!data.error) {
            const index = this.getProductIndex(this.delProductId);
            if (index >= 0) {
              this.products.splice(index, 1);
              this.alertMsgSuccess = 'Product deleted successfully';
              this.delProductId = null;
              this.delProductName = null;
            }
          } else {
            this.alertMsgFail = 'Product not deleted.' + data.error;
          }
      }, error => {
          this.alertMsgFail = 'Product not deleted. Server Error!';
      });
    }
  }

  getProductIndex(id: string) {
    return this.products.findIndex(product => {
      return product['_id'] === id;
    });
  }
}

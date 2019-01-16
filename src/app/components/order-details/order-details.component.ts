import { TaxRateService } from './../../services/taxrate.service';
import { OrderService } from './../../services/order.service';
import { ProductService } from './../../services/product.service';
import { Product } from './../../models/product.model';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewOrderService } from 'src/app/services/neworder.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('productSBtn') productSBtn: ElementRef;
  products: Product[];
  curPage = 0;
  totalPages: number;
  totalRecs: number;
  navPages: number[];
  startPage = 0;
  endPage = 0;
  prodOpts: {};
  stockOpt: boolean;
  dataSubs: Subscription;
  productS: string;
  codeS: string;
  companyS: string;
  tempProdArr: Product[] = [];
  curOrder;
  editType: string;
  curProd;
  curProdDiscount: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private newOrderService: NewOrderService,
    private taxRateService: TaxRateService

  ) {}

  onProductSearch(prodOpts: { code?: string; name?: string; company?: string; page?: number }) {
    // Show only in stok product by default
    this.stockOpt = true;
    this.taxRateService.getTaxes();
    // Compare old and new params, so that page is not reloaded if no changes
    this.prodOpts = prodOpts;
    // Get data from data service by passing the params
    this.dataSubs = this.productService.getData(this.prodOpts).subscribe(
      data => {
        // Copy new values if records or number of pages change
        if (this.totalRecs !== data.totalRecs || this.totalPages !== data.totalPages) {
          this.endPage = 0;
        }
        this.products = data.products;
        this.curPage = data.curPage;
        this.totalPages = data.totalPages;
        this.totalRecs = data.totalRecs;
        // Execute pagination logic
        this.pageLogic();
      },
      error => {
        // Set all fields to default if no records found or server error
        this.products = [];
        this.curPage = 1;
        this.totalPages = 1;
        this.totalRecs = 0;
        this.pageLogic();
      }
    );
  }

  showProducts() {
    this.productSBtn.nativeElement.click();
  }

  ngOnInit() {
    this.retrieveOrder();
  }

  retrieveOrder() {
    this.curOrder = this.newOrderService.curOrder;
  }

  addProductToArr(product, addProduct) {
    if (addProduct) {
      this.tempProdArr.push(product);
    } else {
      this.tempProdArr.splice(this.tempProdArr.indexOf(product), 1);
    }
  }
  
  addProductsToOrder() {
    this.tempProdArr.forEach(product => {
      this.newOrderService.addOrderItem(product);
    });
    this.tempProdArr = [];
    this.retrieveOrder();
  }
  
  editProduct(value) {
    if (this.editType === 'Discount') {
      this.newOrderService.addOrderItem(this.curProd.product, value, this.curProd.quantity);
    } else if (this.editType === 'Quantity') {
      this.newOrderService.addOrderItem(this.curProd.product, this.curProd.discountRate, value);
    }
    this.retrieveOrder();
  }

  pageLogic() {
    // If previous page requested is less than first page link and not zero
    if (this.curPage < this.startPage && this.curPage >= 0) {
      // Clear page array and fill with only 5 pages or total pages in case less that 5 pages
      this.navPages = [];
      this.startPage = this.curPage - 2 > 0 ? this.curPage - 2 : 1;
      this.endPage = this.startPage + 2 > this.totalPages ? this.totalPages : this.startPage + 2;
      for (let i = this.startPage; i <= this.endPage; i++) {
        this.navPages.push(i);
      }
    }

    // If next page requested is greater than last page link and not the last page
    if (this.curPage > this.endPage && this.curPage <= this.totalPages) {
      this.navPages = [];
      this.endPage = this.curPage + 2 > this.totalPages ? this.totalPages : this.curPage + 2;
      this.startPage = this.endPage - 2 > 0 ? this.endPage - 2 : 1;
      for (let i = this.startPage; i <= this.endPage; i++) {
        this.navPages.push(i);
      }
    }
  }

  getProductIndex(id: string) {
    return this.products.findIndex(product => {
      return product['_id'] === id;
    });
  }

  ngOnDestroy() {
    if (this.dataSubs) {
      this.dataSubs.unsubscribe();
    }
  }
}

import { OrderDetails } from './../../models/order.model';
import { TaxRateService } from './../../services/taxrate.service';
import { OrderService } from './../../services/order.service';
import { ProductService } from './../../services/product.service';
import { NewOrderService } from './../../services/neworder.service';
import { CustomerService } from './../../services/customer.service';
import { Product } from './../../models/product.model';
import { Customer } from './../../models/customer.model';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('productSBtn') productSBtn: ElementRef;
  @ViewChild('customerSBtn') customerSBtn: ElementRef;
  products: Product[];
  customers: Customer[];
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
  customerS: string;
  alltaxrates: string[];
  tempProdArr: Product[] = [];
  curOrder;
  editType: string;
  curProd;
  curProdDiscount: number;
  custOpts: {};
  curSearch = '';
  tempCust: Customer;
  mode: string;
  prvParams: {};
  alertMsgSuccess: string;
  alertMsgFail: string;
  fragment: string;
  isModalDataLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private customerService: CustomerService,
    private newOrderService: NewOrderService,
    private orderService: OrderService,
    private taxRateService: TaxRateService
  ) {}

  ngOnInit() {
    // Store mode new/edit/display
    this.fragment = 'customer';
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.route.queryParamMap.subscribe(params => {
      this.prvParams = {
        id: params.get('id')
      };
      this.prvParams['id'] = null;
      if (this.mode === 'edit' || this.mode === 'display') {
        this.curOrder = this.orderService.getSingle(params.get('id'));
        this.newOrderService.setOrder(this.curOrder);
        this.retrieveOrder();
        if (!this.curOrder) {
          this.router.navigate(['/orders'], {
            queryParams: this.prvParams
          });
        }
      } else{
        this.newOrderService.createOrder();
        this.retrieveOrder();
      }
    });
  }

  onNext() {
    if (this.fragment === 'customer') {
      this.fragment = 'details';
    } else if (this.fragment === 'details') {
      this.fragment = 'summary';
    } else if (this.fragment === 'summary') {
      if (this.mode === 'display') {
        this.router.navigate(['orders']);
      } else {
        this.saveOrder();
      }
    }
  }

  onPrevious() {
    if (this.fragment === 'summary') {
      this.fragment = 'details';
    } else if (this.fragment === 'details') {
      this.fragment = 'customer';
    }
  }

  saveOrder() {
    this.alertMsgFail = null;
    this.alertMsgSuccess = null;
    if (
      !this.curOrder ||
      this.curOrder.details.length === 0 ||
      !this.curOrder.customername ||
      this.curOrder.customername === ''
    ) {
      this.alertMsgFail = 'Incomplete Order Details';
    } else {
      if (this.mode === 'new') {
        this.orderService.createData({...this.curOrder}).subscribe(data => {
          console.log('New:', data);
          if (data.orderno) {
            this.newOrderService.createOrder();
            this.retrieveOrder();
            this.fragment = 'customer';
            this.alertMsgSuccess = 'Record Added Successfully';
          } else {
            this.alertMsgFail = 'Error Creating Error';
          }
        });
      } else {
        this.orderService.updateData({ ...this.curOrder }).subscribe(data => {
          console.log('Update:', data);
          this.newOrderService.setOrder(data[0]);
          this.retrieveOrder();
          this.alertMsgSuccess = 'Record Updated Successfully';
        });
      }
    }
  }

  deleteOrderItem() {
    this.newOrderService.deleteOrderItem(this.curOrder.details.indexOf(this.curProd));
    this.retrieveOrder();
  }

  onProductSearch(prodOpts: { code?: string; name?: string; company?: string; page?: number }) {
    this.tempProdArr = [];
    this.isModalDataLoading = true
    if (this.curSearch !== 'product') {
      this.curSearch = 'product';
      this.curPage = 1;
      this.totalPages = 1;
      this.totalRecs = 0;
    }
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
        this.isModalDataLoading = false;
      },
      error => {
        // Set all fields to default if no records found or server error
        this.products = [];
        this.curPage = 1;
        this.totalPages = 1;
        this.totalRecs = 0;
        this.pageLogic();
        this.isModalDataLoading = false;
      }
    );
  }

  showProducts() {
    this.productSBtn.nativeElement.click();
  }

  retrieveOrder() {
    this.curOrder = this.newOrderService.curOrder;
    this.alltaxrates = this.newOrderService.alltaxrates;
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
      this.newOrderService.addOrderItem({ ...product });
    });
    this.tempProdArr = [];
    this.retrieveOrder();
  }

  editProduct(value) {
    if (this.editType === 'Discount') {
      this.newOrderService.addOrderItem(this.curProd.product, value, this.curProd.quantity);
    } else if (this.editType === 'Quantity') {
      this.newOrderService.addOrderItem(this.curProd.product, this.curProd.discountRate, value);
    } else if (this.editType === 'Overall Discount') {
      this.newOrderService.addDiscount(value);
    }
    this.retrieveOrder();
  }

  showCustomers() {
    this.customerSBtn.nativeElement.click();
  }

  addCustomerToOrder() {
    this.newOrderService.addCustomer(this.tempCust);
    this.retrieveOrder();
  }

  onCustomerSearch(custOpts: { name?: string; page?: number }) {
    this.customers = [];
    this.isModalDataLoading = true
    if (this.curSearch !== 'customer') {
      this.curSearch = 'customer';
      this.curPage = 1;
      this.totalPages = 1;
      this.totalRecs = 0;
    }
    // Compare old and new params, so that page is not reloaded if no changes
    this.custOpts = custOpts;
    // Get data from data service by passing the params
    this.dataSubs = this.customerService.getData(this.custOpts, 'Customer').subscribe(
      data => {
        // Copy new values if records or number of pages change
        if (this.totalRecs !== data.totalRecs || this.totalPages !== data.totalPages) {
          this.endPage = 0;
        }
        this.customers = data.customers;
        this.curPage = data.curPage;
        this.totalPages = data.totalPages;
        this.totalRecs = data.totalRecs;
        // Execute pagination logic
        this.pageLogic();
        this.isModalDataLoading = false;
      },
      error => {
        // Set all fields to default if no records found or server error
        this.customers = [];
        this.curPage = 1;
        this.totalPages = 1;
        this.totalRecs = 0;
        this.pageLogic();
        this.isModalDataLoading = false;
      }
    );
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

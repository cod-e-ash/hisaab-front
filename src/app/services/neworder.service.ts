import { Customer } from './../models/customer.model';
import { TaxRateService } from './taxrate.service';
import { Injectable } from '@angular/core';
import { Product } from './../models/product.model';
import { Order, OrderDetails } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class NewOrderService {
  curOrder: Order;
  alltaxrates = [];

  constructor(private taxRateService: TaxRateService) {}

  createOrder(customer?: Customer) {
    if (customer) {
      this.curOrder = {
        customername: customer.name,
        customer: customer,
        details: []
      };
    } else {
      this.curOrder = { details: [] };
    }
  }

  addCustomer(customer: Customer) {
    if (!this.curOrder) {
      this.createOrder(customer);
    } else {
      this.curOrder.customername = customer.name;
      this.curOrder.customer = customer;
    }
  }

  async addOrderItem(product: Product, discountRate?: number, quantity?: number) {
    let isNew = true;
    let foundIndex = -1;
    let prvQuantity = 0;
    let prvDiscountRate = 0;

    // Create new Order Item if currently not added to array
    if (!this.curOrder) {
      this.createOrder();
    } else {
      this.curOrder.details.forEach((detail, index) => {
        if (detail.product.name === product.name) {
          isNew = false;
          foundIndex = index;
          prvQuantity = detail.quantity;
          prvDiscountRate = detail.discountrate;
        }
      });
    }

    discountRate = discountRate ? discountRate : prvDiscountRate;
    quantity = quantity ? quantity : prvQuantity + 1;

    let total = product.price + (product.mrp * product.margin) / 100;
    const discount = discountRate ? total * (discountRate / 100) : 0;
    total = total - discount;
    const taxrate = this.taxRateService.getTaxRate(product.taxrate);
    const tax = (taxrate / 100) * total;

    if (isNew) {
      const newItem: OrderDetails = {
        itemno: this.curOrder.details ? this.curOrder.details.length + 1 : 1,
        product: product,
        price: product.price,
        quantity: quantity ? quantity : 1,
        discountrate: discountRate,
        discount: discount,
        tax: Math.round((tax + 0.00001) * 100) / 100,
        total: Math.round((total + 0.00001) * 100) / 100
      };

      this.curOrder.details.push(newItem);
    } else {
      // If Product already Exist, change the quantity

      // QUANTITY
      this.curOrder.details[foundIndex].quantity = quantity;

      // DISCOUNT
      this.curOrder.details[foundIndex].discountrate = discountRate;
      this.curOrder.details[foundIndex].discount =
        discount * this.curOrder.details[foundIndex].quantity;

      // TAX
      this.curOrder.details[foundIndex].tax = tax * this.curOrder.details[foundIndex].quantity;

      // TOTAL AMOUNT
      this.curOrder.details[foundIndex].total = total * this.curOrder.details[foundIndex].quantity;
    }
    this.calculateSummary();
  }

  addDiscount(discountrate) {
    if (!this.curOrder) {
      this.createOrder();
    }
    this.curOrder.discountrate = discountrate;
    this.calculateSummary();
  }

  calculateSummary() {
    let total = 0;
    let totaltax = 0;
    let discount = 0;
    this.alltaxrates = [];

    this.curOrder.details.forEach(item => {
      total += item.total;
      totaltax += item.tax;
      if (
        this.alltaxrates.indexOf(item.product.taxrate) < 0 &&
        item.product.taxrate !== 'Excempted'
      ) {
        this.alltaxrates.push(item.product.taxrate);
      }
    });
    if (this.curOrder.discountrate && this.curOrder.discountrate > 0) {
      discount = total * (this.curOrder.discountrate / 100);
      totaltax = totaltax - totaltax * (this.curOrder.discountrate / 100);
    }
    this.curOrder.total = total;
    this.curOrder.discount = discount;
    this.curOrder.totaltax = totaltax;
    this.curOrder.finalamount = total - discount;
  }

  setOrder(order: Order) {
    if (!order) {
      return;
    }
    this.curOrder = order;
    this.calculateSummary();
  }
}

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

  constructor(private taxRateService: TaxRateService) {}

  createOrder(customer?: Customer) {
    if (customer) {
      this.curOrder = {
        customer: customer
      };
    } else {
      this.curOrder = { details: [] };
    }
  }

  clearOrder() {
    this.curOrder = null;
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
    quantity = quantity ? quantity : prvQuantity+1;

    let total = product.price + (product.mrp * product.margin) / 100;
    const discount = discountRate ? total * (discountRate / 100) : 0;
    total = total - discount;
    const taxrate = this.taxRateService.getTaxRate(product.taxrate);
    const tax = ( taxrate / 100) * total;

    if (isNew) {
      const newItem: OrderDetails = {
        itemno: this.curOrder.details ? this.curOrder.details.length + 1 : 1,
        product: product,
        price: product.price,
        quantity: quantity ? quantity : 1,
        discountrate: discountRate,
        discount: discount,
        tax: Math.round((tax + 0.00001)*100)/100,
        total: Math.round((total+ 0.00001)*100)/100
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
  }
}

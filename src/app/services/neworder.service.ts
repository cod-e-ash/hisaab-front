import { Customer } from './../models/customer.model';
import { TaxRateService } from './taxrate.service';
import { Injectable } from '@angular/core';
import { Product } from './../models/product.model';
import { Order, OrderDetails } from '../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class CurOrderService {
    
    curOrder: Order;

    constructor(private taxRateService: TaxRateService){}

    createOrder(customer?: Customer) {
        if (customer) {
            this.curOrder = {
                customer: customer,
            }
        } else {
            this.curOrder = {};
        }
    }

    clearOrder() {
        this.curOrder = null;
    }

    addOrderItem(product: Product, discountRate: number = 0, quantity?: number) {
        
        discountRate = discountRate ? discountRate : 0;
        const total = (product.price + (product.mrp * product.margin));
        const discount = (discountRate ? total * (discountRate/100) : 0);
        const amount = (total - discount);
        const tax = (this.taxRateService.getTaxRate(product.taxrate)/100 * amount);
        let isNew = true;
        let foundIndex = -1;
        // Create new Order Item if currently not added to array
        if (!this.curOrder) {
            this.createOrder();
        } else {
            this.curOrder.details.forEach((detail, index) => {
                if (detail.product.name === product.name) {
                    isNew = false;
                    foundIndex = index;
                }
            });
        }
        
        if (isNew) {
            const newItem: OrderDetails = {
                itemno: this.curOrder.details.length + 1,
                product: product,
                price: product.price,
                quantity: quantity ? quantity : 1,
                discountrate: discountRate,
                discount: discount,
                tax: tax,
                total: amount
            };
            
            this.curOrder.details.push(newItem);

        } else {
            // If Product already Exist, change the quantity
                   
            // Quantity
            if (quantity) {
                this.curOrder.details[foundIndex].quantity = quantity;
            } else {
                this.curOrder.details[foundIndex].quantity += 1;
            }
            
            // DISCOUNT
            this.curOrder.details[foundIndex].discountrate = discountRate ? discountRate : 0;
            this.curOrder.details[foundIndex].discount = discount * this.curOrder.details[foundIndex].quantity;
            
            // TAX
            this.curOrder.details[foundIndex].tax = tax * this.curOrder.details[foundIndex].quantity;
            
            // TOTAL AMOUNT
            this.curOrder.details[foundIndex].total = total * this.curOrder.details[foundIndex].quantity;
        }
    }
}

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NewOrderService {
    curOrder = {};
    curItemNo = 0;

    createOrder(orderDetails: {}) {
        this.curOrder = {...orderDetails};
    }

    resetOrder() {
        this.curOrder = {};
    }

    addOrderItem(product: 1) {
        this.curItemNo += 1;
    }
}

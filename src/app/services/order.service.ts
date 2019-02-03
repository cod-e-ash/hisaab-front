import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from './../models/order.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[];
  private url = 'http://localhost:3000/api/orders';

  // HTTP Options
  private httpOptions = {
    headers: new HttpHeaders({
      'x-auth-token':
        'xxxyyyzzz'
    })
  };

  // Constructor
  constructor(private http: HttpClient) {}

  // HTTP GET
  getData(inParams: {
    page?: number;
    orderno?: string;
    client?: string;
    statusOpt?: string;
    fromDate?: string;
    toDate?: string;
  }) {
    const params = new HttpParams()
      .set('page', (inParams && inParams.page ? inParams.page : 1).toString())
      .set('client', inParams && inParams.client ? inParams.client : '')
      .set('orderno', inParams && inParams.orderno ? inParams.orderno : '')
      .set('statusOpt', inParams && inParams.statusOpt ? inParams.statusOpt : '')
      .set('fromDate', inParams && inParams.fromDate ? inParams.fromDate : '')
      .set('toDate', inParams && inParams.toDate ? inParams.toDate : '');

    return this.http
      .get<{
        error: string;
        totalRecs: number;
        totalPages: number;
        curPage: number;
        orders: Order[];
      }>(this.url, { params: params })
      .pipe(
        tap(data => {
          this.orders = data.orders;
        })
      );
  }

  createData(newdata: any) {
    // Set Customer ID
    const data = JSON.parse(JSON.stringify(newdata));
    data['customername'] = data.customer.name;
    data['customer'] = data.customer._id;
    data.details.forEach((detail, index) => {
      data.details[index]['product'] = detail.product._id;
    });
    return this.http.post<Order>(this.url, data, this.httpOptions);
  }

  patchData(id: string, status: boolean) {
    const data = { _id: id, status: status };
    return this.http.patch(this.url + '/' + id, data, this.httpOptions);
  }

  updateData(newdata: any) {
    const data = JSON.parse(JSON.stringify(newdata));
    data['customername'] = data.customer.name;
    data['customer'] = data.customer._id;
    data.details.forEach((detail, index) => {
      data.details[index]['product'] = detail.product._id;
    });
    return this.http.put(this.url + '/' + data._id, data, this.httpOptions);
  }

  deleteData(id: string) {
    return this.http.delete<{ error?: string; order?: Order }>(
      this.url + '/' + id,
      this.httpOptions
    );
  }

  getSingle(id: string) {
    if (this.orders) {
      return this.orders.filter(order => {
        return order._id === id;
      })[0];
    }
  }
}

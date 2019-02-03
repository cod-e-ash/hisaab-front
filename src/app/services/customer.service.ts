import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from './../models/customer.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customers: Customer[];
  private url = 'http://localhost:3000/api/customers';

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
  getData(inParams: { page?: number; name?: string }, type: string) {
    const params = new HttpParams()
      .set('page', (inParams && inParams.page ? inParams.page : 1).toString())
      .set('name', inParams && inParams.name ? inParams.name : '')
      .set('type', type ? type : 'Customer');

    return this.http
      .get<{
        error: string;
        totalRecs: number;
        totalPages: number;
        curPage: number;
        customers: Customer[];
      }>(this.url, { params: params })
      .pipe(
        tap(data => {
          this.customers = data.customers;
        })
      );
  }

  createData(data: Customer) {
    return this.http.post<Customer>(this.url, data, this.httpOptions);
  }

  patchData(id: string, status: boolean) {
    const data = { _id: id, status: status };
    return this.http.patch(this.url + '/' + id, data, this.httpOptions);
  }

  updateData(data: Customer) {
    return this.http.put(this.url + '/' + data._id, data, this.httpOptions);
  }

  deleteData(id: string) {
    return this.http.delete<{ error?: string; customer?: Customer }>(
      this.url + '/' + id,
      this.httpOptions
    );
  }

  getSingle(id: string) {
    if (this.customers) {
      return this.customers.filter(customer => {
        return customer._id === id;
      })[0];
    }
  }
}

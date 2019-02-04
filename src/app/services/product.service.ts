import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './../models/product.model';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[];
  private url = environment.apiUrl + '/products';

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
    code?: string;
    page?: number;
    name?: string;
    company?: string;
    stockOpt?: string;
  }) {
    const params = new HttpParams()
      .set('code', (inParams && inParams.code ? inParams.code : ''))
      .set('page', (inParams && inParams.page ? inParams.page : 1).toString())
      .set('name', inParams && inParams.name ? inParams.name : '')
      .set('company', inParams && inParams.company ? inParams.company : '')
      .set('stockOpt', inParams && inParams.stockOpt ? inParams.stockOpt : '');

    return this.http
      .get<{
        error: string;
        totalRecs: number;
        totalPages: number;
        curPage: number;
        products: Product[];
      }>(this.url, {
        params: params
      })
      .pipe(
        tap(data => {
          this.products = data.products;
        })
      );
  }

  createData(data: Product) {
    return this.http.post<Product>(this.url, data, this.httpOptions);
  }

  patchData(id: string, status: boolean) {
    const data = {
      _id: id,
      status: status
    };
    return this.http.patch(this.url + '/' + id, data, this.httpOptions);
  }

  updateData(data: Product) {
    return this.http.put(this.url + '/' + data._id, data, this.httpOptions);
  }

  deleteData(id: string) {
    return this.http.delete<{
      error?: string;
      product?: Product;
    }>(this.url + '/' + id, this.httpOptions);
  }

  getSingle(id: string) {
    if (this.products) {
      return this.products.filter(product => {
        return product._id === id;
      })[0];
    }
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = 'http://localhost:3000/api/products';

  private httpOptions = {headers: new HttpHeaders({
      'x-auth-token':
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFudXNocmkiLCJmdWxsbmFtZSI6ImFudXNocmkgYXJvcmEiLCJyb2xlIjoidXNlciIsImlhdCI6MTU0NjE0MDc0OH0.a4NEIya-nJOhrAUKMgZvmVq8UHjE4pPJpzFULyxK_cM'
    })
  };

  constructor(private http: HttpClient) { }

  getData () {
    return this.http.get<Product[]>(this.url);
  }

  createData (data: Product) {
    return this.http.post<Product>(this.url, data, this.httpOptions);
  }

  patchData (id: string, status: boolean ) {
    const data = {_id: id, status: status };
    return this.http.patch(this.url + '/' + id, data, this.httpOptions);
  }

  updateData (data: Product ) {
    return this.http.patch(this.url + '/' + data._id, data, this.httpOptions);
  }

  deleteData (id: string) {
    return this.http.delete(this.url + '/' + id, this.httpOptions );
  }

}

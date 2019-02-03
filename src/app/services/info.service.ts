import { CompanyService } from './company.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    'providedIn':'root'
})
export class InfoService {
    
    private url = "http://localhost:3000/api/info"

    constructor(private http: HttpClient) {}

    getOrderInfo(year: number, month:number) {

        const params = new HttpParams()
        .set('year', (year ? year : 0).toString())
        .set('month', (month ? month : 0).toString());

        return this.http.get(this.url + '/orders', {params: params});
    }

    getClientInfo() {
        return this.http.get(this.url + '/clients');
    }

    getProductInfo() {
        return this.http.get(this.url + '/products');
    }
}
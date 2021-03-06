import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
    'providedIn':'root'
})
export class InfoService {
    
    private url = environment.apiUrl + '/info';

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

    getTaxReport(fyear, fmonth, tyear, tmonth) {
        const params = new HttpParams()
        .set('startyear', (fyear ? fyear : 0).toString())
        .set('startmonth', (fmonth ? fmonth : 0).toString())
        .set('endyear', (tyear ? tyear : 0).toString())
        .set('endmonth', (tmonth ? tmonth : 0).toString());

        return this.http.get(this.url + '/tax', {params: params});
    }
}
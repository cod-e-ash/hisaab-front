import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    'providedIn':'root'
})
export class InfoService {
    
    private url = "http://localhost:3000/api/info"

    constructor(private http: HttpClient) {}

    getOrderInfo() {
        return this.http.get(this.url + '/orderstatus');
    }
}
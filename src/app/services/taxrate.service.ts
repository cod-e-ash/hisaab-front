import { TaxRate } from './../models/taxrate.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class TaxRateService{
    taxRates: {};
    private url = 'http://localhost:3000/api/taxrates';

    constructor(private http: HttpClient){}

    getTaxes() {
        this.http.get<TaxRate[]>(this.url)
        .subscribe(data => {
            data.forEach(tax => {
                this.taxRates[tax.name] = tax.rate;
            });
        });
    }
    
    getTaxRate(taxName: string):number {
        return this.taxRates[taxName] ? this.taxRates[taxName] : 0;
    }
}
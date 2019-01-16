import { TaxRate } from './../models/taxrate.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaxRateService {
  taxRates: {};
  private url = 'http://localhost:3000/api/taxrates';

  constructor(private http: HttpClient) {}

  getTaxes() {
    if (!this.taxRates) {
      this.taxRates = {};
      this.http.get<TaxRate[]>(this.url).subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.taxRates[data[i].name] = data[i].rate;
        }
      });
    }
  }

  getTaxRate(taxName: string): number {
      return this.taxRates[taxName] ? this.taxRates[taxName] : 0;
  }
}

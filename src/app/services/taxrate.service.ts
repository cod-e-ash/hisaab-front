import { TaxRate } from './../models/taxrate.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaxRateService {
  taxRates: {};
  private url = environment.apiUrl + '/taxrates';

  constructor(private http: HttpClient) {}

  getTaxes() {
    if (!this.taxRates) {
      this.taxRates = {};
      this.http.get<TaxRate[]>(this.url).subscribe(data => {
        // tslint:disable-next-line: curly
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

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { TaxRate } from './../models/taxrate.model';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaxRateService {
  taxRate: TaxRate;
  taxRates: TaxRate[];

  private url = environment.apiUrl + '/taxrates';

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'x-auth-token':
      'xxxyyyzzz'
    })
  };

  getTaxes() {
    if (!this.taxRates) {
      this.taxRates = [];
      this.http.get<TaxRate[]>(this.url).subscribe(data => {
        // tslint:disable-next-line: curly
        for (let i = 0; i < data.length; i++) {
          this.taxRates[data[i].name] = data[i].rate;
        }
      });
    }
  }

  // HTTP GET
  getData(inParams: { page?: number; name?: string }) {
    const params = new HttpParams()
      .set('page', (inParams && inParams.page ? inParams.page : 1).toString())
      .set('name', inParams && inParams.name ? inParams.name : '')
    return this.http
      .get<{
        error: string;
        totalRecs: number;
        totalPages: number;
        curPage: number;
        taxRates: TaxRate[];
      }>(this.url, { params: params })
      .pipe(
        tap(data => {
          this.taxRates = data.taxRates;
        })
      );
  }

  createData(data: TaxRate) {
    return this.http.post<TaxRate>(this.url, data, this.httpOptions);
  }

  // patchData(id: string, status: boolean) {
  //   const data = { _id: id, status: status };
  //   return this.http.patch(this.url + '/' + id, data, this.httpOptions);
  // }

  updateData(data: TaxRate) {
    return this.http.put(this.url + '/' + data.name, data, this.httpOptions);
  }

  deleteData(id: string) {
    return this.http.delete<{ error?: string; taxRate?: TaxRate }>(
      this.url + '/' + id,
      this.httpOptions
    );
  }

  getTaxRate(taxName: string): TaxRate {
    if (this.taxRates) {
      return this.taxRates.filter(taxRate => {
        return taxRate.name === taxName;
      })[0];
    }
  }

  getSingle(name: string): TaxRate {
    if (this.taxRates) {
      return this.taxRates.filter(taxRate => {
        return taxRate.name === name;
      })[0];
    }
  }

}

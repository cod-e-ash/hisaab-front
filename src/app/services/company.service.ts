import { tap } from 'rxjs/operators';
import { of } from 'rxjs'
import { Injectable } from '@angular/core';
import { Company } from './../models/company.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    company: Company;
    url = 'http://localhost:3000/api/company'

    constructor(private http: HttpClient) {}

    getCompany() {
        if (!this.company) {
            return this.http.get<{error: string, company: Company}>(this.url)
            .pipe(
                tap(data => {
                    this.company = data.company;
                })
            );
        } else {
            return of({data: this.company});
        }
    }

    setCompany(company) {
        if (!this.company) {
            return this.http.post<{error: string, company: Company}>(this.url, company)
            .pipe(
                tap(data => {
                    this.company = data.company
                })
            );
        } else {
            return this.http.put<{error: string, company: Company}>(this.url, company)
            .pipe(
                tap(data => {
                    this.company = data.company
                })
            );
        }
    }

}
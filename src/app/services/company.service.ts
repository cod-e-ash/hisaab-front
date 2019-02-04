import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Company } from './../models/company.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    company: Company;
    private companyUpdSubject = new Subject<Company>();
    url = 'http://localhost:3000/api/company'

    constructor(private http: HttpClient) {}

    getCompanyFromServer() {
        this.http.get<{error: string, company: Company}>(this.url).subscribe(data => {
            this.company = data.company;
            this.emitCompanyEvent();
        });
    }

    emitCompanyEvent() {
        this.companyUpdSubject.next(this.company);
    }

    getCompanyListner() {
        return this.companyUpdSubject.asObservable();
    }

    setCompany(company) {
        if (!this.company || !this.company.name) {
            return this.http.post<{error: string, company: Company}>(this.url, company)
            .pipe(
                tap(data => {
                    this.company = data.company;
                    this.emitCompanyEvent();
                })
            );
        } else {
            return this.http.put<{error: string, company: Company}>(this.url, company)
            .pipe(
                tap(data => {
                    this.company = data.company;
                    this.emitCompanyEvent();
                })
            );
        }
    }

}
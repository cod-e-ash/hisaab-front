import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthDetails, UserDetails } from '../models/auth.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {

    private token: string;
    private username: string;
    private curUserSubject = new Subject<string>();
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private router: Router) {}

    createUser(userDetails: UserDetails, password: string) {
        const newUser = {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            username: userDetails.username,
            password: password};
       return this.http.post<{message: string,
        token: string,
        username: string,
        err: any}>(this.apiUrl + '/users/signup', newUser)
        .pipe(map(rspData => {
            if (rspData.message === 'success') {
                this.token = rspData.token;
                this.username = rspData.username;
                this.emitSubjectEvent();
                localStorage.setItem('currentUser', JSON.stringify(rspData));
                return 'created and logged';
            } else {
                return 'err';
            }
        }));
    }

    loginUser(authDetails: AuthDetails) {
        return this.http.post<{
            message: string,
            token: string,
            username: string,
            err: any}>(this.apiUrl + '/users/login', authDetails)
        .pipe(map(rspData => {
            console.log(rspData);
            if (rspData.message === 'success') {
                this.token = rspData.token;
                this.username = rspData.username;
                this.emitSubjectEvent();
                localStorage.setItem('currentUser', JSON.stringify(rspData));
                return 'logged';
            } else {
                return 'err';
            }
        }));
    }

    getAuthToken() {
        return this.token;
    }

    getAuthUser() {
        if (!this.username || this.username === '') {
            const curUser = JSON.parse(localStorage.getItem('currentUser'));
            if (curUser) {
                this.username = curUser.username;
                this.token = curUser.token;
            }
        }
        return this.username;
    }

    emitSubjectEvent() {
      this.curUserSubject.next(this.username);
    }

    getCurUserListener() {
      return this.curUserSubject.asObservable();
    }

    logoutUser() {
        this.token = null;
        this.username = null;
        this.emitSubjectEvent();
        localStorage.removeItem('currentUser');
        // this.curUserSubject.complete();
    }

}

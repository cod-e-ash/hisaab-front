import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler ) {
        const user = this.authService.getAuthUser();
        const token = this.authService.getAuthToken();
        if (token && user) {
            const authReq = req.clone({
                headers: req.headers
                .set('Authorization', 'Bearer ' + token)
                .set('User', user)
            });
            return next.handle(authReq);
        } else {
            return next.handle(req);
        }
    }
}

import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from './message.service';
import { Router } from '@angular/router';
import { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, NOT_FOUND } from 'http-status-codes'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //debugger;
        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.accessToken) {
            //debugger;
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser.accessToken}`
                }
            });
        }

        //return next.handle(request);

        return next.handle(request).pipe(catchError((error, caught) => {
            //intercept the respons error and displace it to the console
            this.handleAuthError(error);
            return of(error);
        }) as any);
    }

    /**
  * manage errors
  * @param response
  * @returns {any}
  */
    private handleAuthError(response: HttpErrorResponse): Observable<any> {

        const messageService = this.injector.get(MessageService);
        const router = this.injector.get(Router);

        if (response.status === UNAUTHORIZED) {
            router.navigate(['/login']);
        }

        if (response.status === INTERNAL_SERVER_ERROR) {
            messageService.error(response.error.errorMessage, "");
            return of(response.message);
        }

        if (response.status === NOT_FOUND) {
            //messageService.error(response.error.errorMessage, "");
            return of(response.message);
        }

        if (response.error.errorMessage !== null || response.error.errorMessage !== undefined || response.error.errorMessage === '') {
            messageService.error(response.error.errorMessage, "");
        }

        throw response;
    }
}

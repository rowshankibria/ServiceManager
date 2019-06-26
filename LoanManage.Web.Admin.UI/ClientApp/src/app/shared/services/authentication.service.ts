import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { environment } from '../../../environments/environment';
import { ApiHttpService } from './../services/api-http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class AuthenticationService {

    private apiUrl: string = '';
    private rootUrl: string = '';

    constructor(private http: HttpClient,
        private apiHttpService: ApiHttpService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.apiUrl = environment.apiUrl;
        this.rootUrl = environment.rootUrl;
    }

    login(username: string, password: string) {
        
        var loginViewModel = new LoginViewModel();
        loginViewModel.email = username;
        loginViewModel.username = username;
        loginViewModel.password = password;

        //this.url = 'herb/clinic/create-clinic';
        //return this.apiHttpService.POST(this.url, data);

        return this.http.post<any>(this.rootUrl + 'token', loginViewModel, { responseType: 'json' })
            .map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.accessToken) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            });


        //return this.getLoginInformation(loginViewModel).map(data => {

        //    if (data && data.accessToken) {
        //        // store user details and jwt token in local storage to keep user logged in between page refreshes
        //        localStorage.setItem('currentUser', JSON.stringify(data));
        //    }

        //    return data;

        //});



    }

    isAuthorized() : boolean {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.accessToken) {
            return true;
        }
        return false;
    }

    getLoginInformation(loginViewModel: LoginViewModel) {
        let url = 'token';
        return this.apiHttpService.POST(url, loginViewModel);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
}


export class LoginViewModel {
    username: string;
    email: string;
    password: string;
}

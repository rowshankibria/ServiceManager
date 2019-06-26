"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
var environment_1 = require("../../../environments/environment");
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(http, apiHttpService, route, router) {
        this.http = http;
        this.apiHttpService = apiHttpService;
        this.route = route;
        this.router = router;
        this.apiUrl = '';
        this.rootUrl = '';
        this.apiUrl = environment_1.environment.apiUrl;
        this.rootUrl = environment_1.environment.rootUrl;
    }
    AuthenticationService.prototype.login = function (username, password) {
        var loginViewModel = new LoginViewModel();
        loginViewModel.email = username;
        loginViewModel.username = username;
        loginViewModel.password = password;
        //this.url = 'herb/clinic/create-clinic';
        //return this.apiHttpService.POST(this.url, data);
        return this.http.post(this.rootUrl + 'token', loginViewModel, { responseType: 'json' })
            .map(function (user) {
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
    };
    AuthenticationService.prototype.isAuthorized = function () {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.accessToken) {
            return true;
        }
        return false;
    };
    AuthenticationService.prototype.getLoginInformation = function (loginViewModel) {
        var url = 'token';
        return this.apiHttpService.POST(url, loginViewModel);
    };
    AuthenticationService.prototype.logout = function () {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    };
    AuthenticationService = __decorate([
        core_1.Injectable()
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
var LoginViewModel = /** @class */ (function () {
    function LoginViewModel() {
    }
    return LoginViewModel;
}());
exports.LoginViewModel = LoginViewModel;
//# sourceMappingURL=authentication.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
//import { Observable } from 'rxjs/Observable';
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var message_service_1 = require("./message.service");
var router_1 = require("@angular/router");
var http_status_codes_1 = require("http-status-codes");
var JwtInterceptor = /** @class */ (function () {
    function JwtInterceptor(injector) {
        this.injector = injector;
    }
    JwtInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        //debugger;
        // add authorization header with jwt token if available
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.accessToken) {
            //debugger;
            request = request.clone({
                setHeaders: {
                    Authorization: "Bearer " + currentUser.accessToken
                }
            });
        }
        //return next.handle(request);
        return next.handle(request).pipe(operators_1.catchError(function (error, caught) {
            //intercept the respons error and displace it to the console
            _this.handleAuthError(error);
            return rxjs_1.of(error);
        }));
    };
    /**
  * manage errors
  * @param response
  * @returns {any}
  */
    JwtInterceptor.prototype.handleAuthError = function (response) {
        var messageService = this.injector.get(message_service_1.MessageService);
        var router = this.injector.get(router_1.Router);
        if (response.status === http_status_codes_1.UNAUTHORIZED) {
            router.navigate(['/login']);
        }
        if (response.status === http_status_codes_1.INTERNAL_SERVER_ERROR) {
            messageService.error(response.error.errorMessage, "");
            return rxjs_1.of(response.message);
        }
        if (response.status === http_status_codes_1.NOT_FOUND) {
            //messageService.error(response.error.errorMessage, "");
            return rxjs_1.of(response.message);
        }
        if (response.error.errorMessage !== null || response.error.errorMessage !== undefined || response.error.errorMessage === '') {
            messageService.error(response.error.errorMessage, "");
        }
        throw response;
    };
    JwtInterceptor = __decorate([
        core_1.Injectable()
    ], JwtInterceptor);
    return JwtInterceptor;
}());
exports.JwtInterceptor = JwtInterceptor;
//# sourceMappingURL=jwt-interceptor.js.map

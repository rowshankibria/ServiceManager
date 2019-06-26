"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var UserService = /** @class */ (function () {
    function UserService(apiHttpService) {
        this.apiHttpService = apiHttpService;
        this.url = '';
    }
    UserService.prototype.getUserList = function (params) {
        this.url = 'system-settings/users/get-active-user-list';
        return this.apiHttpService.GETGridData(this.url, params);
    };
    UserService.prototype.getUserDetailEntity = function (id) {
        debugger;
        this.url = 'system-settings/users/get-user-detail?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    UserService.prototype.getContactDetailForUserCreation = function (id) {
        this.url = 'system-settings/users/get-contact-for-user-detail?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    UserService.prototype.createUser = function (data) {
        this.url = 'system-settings/users/insert-user-detail';
        return this.apiHttpService.POST(this.url, data);
    };
    UserService.prototype.updateUser = function (id, data) {
        this.url = 'system-settings/users/update-user-detail/' + id;
        return this.apiHttpService.PUT(this.url, data);
    };
    UserService.prototype.deleteEntity = function (id) {
        this.url = 'system-settings/users/delete-user/' + id;
        return this.apiHttpService.DELETE(this.url);
    };
    UserService.prototype.deleteEntities = function (ids) {
        this.url = 'system-settings/users/delete-users/';
        return this.apiHttpService.POST(this.url, ids);
    };
    UserService.prototype.getEntitiesDataSource = function (userType) {
        var url = '';
        // if (userType == UserType.Employee) {
        url = 'system-settings/users/get-entity-on-usertype';
        //}
        return this.apiHttpService.POST(url, userType);
    };
    UserService.prototype.changePassword = function (data) {
        var url = 'application-service/account/change-password';
        return this.apiHttpService.POST(url, data);
    };
    UserService.prototype.getChangePassword = function () {
        var url = 'application-service/account/get-change-password';
        return this.apiHttpService.GET(url);
    };
    UserService = __decorate([
        core_1.Injectable()
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var RoleService = /** @class */ (function () {
    function RoleService(apiHttpService) {
        this.apiHttpService = apiHttpService;
        this.url = '';
    }
    RoleService.prototype.getRoleList = function () {
        this.url = 'system-settings/roles/get-active-role-list';
        return this.apiHttpService.GET(this.url);
    };
    RoleService.prototype.getRole = function (id) {
        this.url = 'system-settings/roles/get-role?id=' + id;
        ;
        return this.apiHttpService.GET(this.url);
    };
    RoleService.prototype.createRole = function (data) {
        this.url = 'system-settings/roles/create-role';
        return this.apiHttpService.POST(this.url, data);
    };
    RoleService.prototype.updateRole = function (id, data) {
        this.url = 'system-settings/roles/update-role/' + id;
        return this.apiHttpService.PUT(this.url, data);
    };
    RoleService.prototype.deleteEntity = function (id) {
        this.url = 'system-settings/roles/delete-custom-category/' + id;
        return this.apiHttpService.DELETE(this.url);
    };
    RoleService.prototype.deleteEntities = function (ids) {
        this.url = 'system-settings/roles/delete-custom-categories/';
        return this.apiHttpService.POST(this.url, ids);
    };
    RoleService.prototype.getUserByRoleList = function (roleId, params) {
        this.url = 'system-settings/roles/get-user-role-list/' + roleId;
        return this.apiHttpService.GETGridData(this.url, params);
    };
    RoleService.prototype.getUserPermissionList = function (parentRoleId) {
        this.url = 'system-settings/roles/get-user-permission-list/' + parentRoleId;
        return this.apiHttpService.GET(this.url);
    };
    RoleService.prototype.getPermissionListByRole = function (ids) {
        this.url = 'system-settings/roles/get-role-right-list';
        return this.apiHttpService.POST(this.url, ids);
    };
    RoleService = __decorate([
        core_1.Injectable()
    ], RoleService);
    return RoleService;
}());
exports.RoleService = RoleService;
//# sourceMappingURL=role.service.js.map
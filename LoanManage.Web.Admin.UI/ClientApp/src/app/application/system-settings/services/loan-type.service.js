"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var LoanTypeService = /** @class */ (function () {
    function LoanTypeService(apiHttpService) {
        this.apiHttpService = apiHttpService;
        this.url = '';
    }
    LoanTypeService.prototype.getLoanType = function (id) {
        this.url = 'loan/configurations/get-loantyle-detail?id=' + id;
        ;
        return this.apiHttpService.GET(this.url);
    };
    LoanTypeService.prototype.getCustomFieldDetail = function (id) {
        this.url = 'loan/configurations/get-custom-field-detail/' + id;
        ;
        return this.apiHttpService.GET(this.url);
    };
    LoanTypeService.prototype.getCustomFieldsByLoanType = function (id) {
        this.url = 'loan/configurations/get-custom-fields-by-loantype/' + id;
        ;
        return this.apiHttpService.GET(this.url);
    };
    LoanTypeService.prototype.createLoanType = function (data) {
        this.url = 'loan/configurations/create-loantype';
        return this.apiHttpService.POST(this.url, data);
    };
    LoanTypeService.prototype.createLoanTypeCustomField = function (data) {
        this.url = 'loan/configurations/create-loantype-custom-field';
        return this.apiHttpService.POST(this.url, data);
    };
    LoanTypeService.prototype.updateLoanType = function (data) {
        this.url = 'loan/configurations/update-loantype';
        return this.apiHttpService.PUT(this.url, data);
    };
    LoanTypeService.prototype.updateCustomField = function (data) {
        this.url = 'loan/configurations/update-custom-field';
        return this.apiHttpService.POST(this.url, data);
    };
    LoanTypeService.prototype.updateGroupOrFieldOrder = function (loanTypeId, groupName, controlId, isDown, isGroupSort) {
        this.url = 'loan/configurations/update-group-or-field-order/' + loanTypeId + "/" + groupName + "/" + controlId + "/" + isDown + "/" + isGroupSort;
        return this.apiHttpService.POST(this.url, null);
    };
    LoanTypeService.prototype.updateGroup = function (data) {
        this.url = 'loan/configurations/update-group';
        return this.apiHttpService.POST(this.url, data);
    };
    LoanTypeService.prototype.deleteLoanType = function (id) {
        this.url = 'loan/configurations/delete-loantype/' + id;
        return this.apiHttpService.DELETE(this.url);
    };
    LoanTypeService.prototype.deleteLoanTypes = function (ids) {
        this.url = 'loan/configurations/delete-loantype';
        return this.apiHttpService.POST(this.url, ids);
    };
    LoanTypeService.prototype.getLoanTypeCustomFieldByLoanTypeId = function (loanTypeId, params) {
        this.url = 'loan/configurations/get-customfields-loantype/' + loanTypeId;
        return this.apiHttpService.GETGridData(this.url, params);
    };
    LoanTypeService.prototype.deleteLoanTypeCustomFieldDetail = function (id) {
        this.url = 'loan/configurations/delete-custom-field/' + id;
        return this.apiHttpService.DELETE(this.url);
    };
    LoanTypeService = __decorate([
        core_1.Injectable()
    ], LoanTypeService);
    return LoanTypeService;
}());
exports.LoanTypeService = LoanTypeService;
//# sourceMappingURL=loan-type.service.js.map
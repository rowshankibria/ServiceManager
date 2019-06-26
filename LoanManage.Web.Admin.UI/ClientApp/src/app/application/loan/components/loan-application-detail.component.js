"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var entityModel_1 = require("../../system-service/models/entityModel");
var LoanApplicationDetailComponent = /** @class */ (function () {
    function LoanApplicationDetailComponent(route, router, loanService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.loanService = loanService;
        this.tabs = [];
        this.entityModel = new entityModel_1.EntityModel();
        this.loanApplicationId = 0;
        this.tabPageServiceStyle = 'tab-item-invisible';
        this.pagekeyComponent = "documents";
        this.route.params.subscribe(function (params) {
            if (params['applicationId'] != undefined) {
                _this.loanApplicationId = params['applicationId'];
            }
        });
        this.entityModel.entityId = this.loanApplicationId;
        this.entityModel.entityType = 501;
        this.initTabs();
    }
    /**
     * initialize tab
     * */
    LoanApplicationDetailComponent.prototype.initTabs = function () {
        var _this = this;
        this.loanService.getLoanApplicationPageDetails(this.loanApplicationId).subscribe(function (data) {
            _this.tabs = data.result.tabItems;
        });
    };
    /**
     * Event
     * */
    LoanApplicationDetailComponent.prototype.ngAfterViewInit = function () {
        //if it is new mode then hide other tab except primary component
        if (this.loanApplicationId != null && this.loanApplicationId != undefined) {
            this.tabPageServiceStyle = "tab-item-visible";
        }
    };
    LoanApplicationDetailComponent = __decorate([
        core_1.Component({
            selector: '.app-loan-application-detail',
            templateUrl: './loan-application-detail.component.html',
            styleUrls: ['./loan-application-detail.component.scss'],
        })
    ], LoanApplicationDetailComponent);
    return LoanApplicationDetailComponent;
}());
exports.LoanApplicationDetailComponent = LoanApplicationDetailComponent;
//# sourceMappingURL=loan-application-detail.component.js.map
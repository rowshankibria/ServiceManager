"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var entityModel_1 = require("../../../system-service/models/entityModel");
var ProductDetailComponent = /** @class */ (function () {
    function ProductDetailComponent(route, router, productService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.productService = productService;
        this.tabs = [];
        this.entityModel = new entityModel_1.EntityModel();
        this.productId = 0;
        this.tabPageServiceStyle = 'tab-item-invisible';
        this.route.params.subscribe(function (params) {
            if (params['productId'] != undefined) {
                _this.productId = params['productId'];
            }
        });
        this.entityModel.entityId = this.productId;
        this.entityModel.entityType = 102;
        this.initTabs();
    }
    /**
     * initialize tab
     * */
    ProductDetailComponent.prototype.initTabs = function () {
        var _this = this;
        this.productService.getPageDetails(this.productId).subscribe(function (data) {
            _this.tabs = data.result.tabItems;
        });
    };
    /**
     * Event
     * */
    ProductDetailComponent.prototype.ngAfterViewInit = function () {
        //if it is new mode then hide other tab except primary component
        if (this.productId != null && this.productId != undefined) {
            this.tabPageServiceStyle = "tab-item-visible";
        }
    };
    ProductDetailComponent = __decorate([
        core_1.Component({
            selector: '.app-product-detail',
            templateUrl: './product-detail.component.html',
            styleUrls: ['./product-detail.component.scss'],
        })
    ], ProductDetailComponent);
    return ProductDetailComponent;
}());
exports.ProductDetailComponent = ProductDetailComponent;
//# sourceMappingURL=product-detail.component.js.map
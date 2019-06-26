"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var list_component_1 = require("./../application-shared/components/list/list.component");
var ims_component_1 = require("./ims.component");
var product_detail_component_1 = require("./components/product/product-detail.component");
var product_form_component_1 = require("./components/product/product-form.component");
var routes = [{
        path: '', component: ims_component_1.ImsComponent,
        children: [
            { path: 'products', component: list_component_1.ListComponent, data: { title: 'Products' } },
            { path: 'product', component: product_detail_component_1.ProductDetailComponent, data: { title: 'New Product' } },
            { path: 'product/:productId', component: product_detail_component_1.ProductDetailComponent, data: { title: 'Product Detail' } },
        ],
    }];
var ImsRoutingModule = /** @class */ (function () {
    function ImsRoutingModule() {
    }
    ImsRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], ImsRoutingModule);
    return ImsRoutingModule;
}());
exports.ImsRoutingModule = ImsRoutingModule;
exports.RoutedComponents = [
    ims_component_1.ImsComponent,
    product_detail_component_1.ProductDetailComponent,
    product_form_component_1.ProductFormComponent
];
//# sourceMappingURL=ims-routing.module.js.map
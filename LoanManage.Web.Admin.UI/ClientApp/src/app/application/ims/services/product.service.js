"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ProductService = /** @class */ (function () {
    function ProductService(apiHttpService) {
        this.apiHttpService = apiHttpService;
        this.url = '';
    }
    ProductService.prototype.getDxGridProducts = function (params) {
        this.url = 'ims/product/get-products';
        return this.apiHttpService.GETDXGrid(this.url, params);
    };
    ProductService.prototype.getProduct = function (id) {
        this.url = 'ims/product/get-product?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    ProductService.prototype.createProduct = function (fileName, data) {
        this.url = 'ims/product/create-product?imageFileName=' + fileName;
        return this.apiHttpService.POST(this.url, data);
    };
    ProductService.prototype.updateProduct = function (fileName, data) {
        this.url = 'ims/product/update-product?imageFileName=' + fileName;
        return this.apiHttpService.PUT(this.url, data);
    };
    ProductService.prototype.deleteProduct = function (id) {
        this.url = 'ims/product/delete-product/' + id;
        return this.apiHttpService.DELETE(this.url);
    };
    ProductService.prototype.deleteProducts = function (ids) {
        this.url = 'ims/product/delete-products/';
        return this.apiHttpService.POST(this.url, ids);
    };
    ProductService.prototype.getPageDetails = function (id) {
        this.url = 'ims/product/get-product-details-tab/' + id;
        return this.apiHttpService.GET(this.url);
    };
    ProductService = __decorate([
        core_1.Injectable()
    ], ProductService);
    return ProductService;
}());
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map
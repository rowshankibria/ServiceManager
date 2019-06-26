import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class ProductService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {
    }

    getDxGridProducts(params: any) {
        this.url = 'ims/product/get-products';        
        return this.apiHttpService.GETDXGrid(this.url, params);
    }

    getProduct(id: any) {
        this.url = 'ims/product/get-product?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    createProduct(fileName: any, data: any) {
        this.url = 'ims/product/create-product?imageFileName=' + fileName;
        return this.apiHttpService.POST(this.url, data);
    }

    updateProduct(fileName: any, data: any) {
        this.url = 'ims/product/update-product?imageFileName=' + fileName;
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteProduct(id: any) {
        this.url = 'ims/product/delete-product/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteProducts(ids: any[]) {
        this.url = 'ims/product/delete-products/';
        return this.apiHttpService.POST(this.url, ids);
    }

    getPageDetails(id: any) {
        this.url = 'ims/product/get-product-details-tab/' + id;
        return this.apiHttpService.GET(this.url);
    }

}



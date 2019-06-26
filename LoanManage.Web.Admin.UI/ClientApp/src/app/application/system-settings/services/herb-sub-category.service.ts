import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class HerbSubCategoryService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {
    }

    getDxGridHerbSubcategories(params: any) {
        this.url = 'herb/configurations/get-herb-sub-categories';
        //return this.apiHttpService.GETDXGrid(this.url, params).toPromise();
        return this.apiHttpService.GETDXGrid(this.url, params);
    }

    getHerbSubcategories() {
        this.url = 'herb/configurations/get-herb-sub-categories';
        return this.apiHttpService.GET(this.url);
    }

    getHerbSubcategorySelectItems(businessProfileId: number) {
        this.url = 'herb/configurations/get-herb-sub-category-select-items/' + businessProfileId;
        return this.apiHttpService.GET(this.url);
    }

    getHerbSubcategory(id: any) {
        this.url = 'herb/configurations/get-herb-sub-category?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    createHerbSubcategory(data: any) {
        this.url = 'herb/configurations/create-herb-sub-category';
        return this.apiHttpService.POST(this.url, data);
    }

    updateHerbSubcategory(id: any, data: any) {
        this.url = 'herb/configurations/update-herb-sub-category/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteHerbSubcategory(id: any) {
        this.url = 'herb/configurations/delete-herb-sub-category/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteHerbSubcategories(ids: any[]) {
        this.url = 'herb/configurations/delete-herb-sub-categories/';
        return this.apiHttpService.POST(this.url, ids);
    }

    getPageDetails(id: any) {
        this.url = 'herb/configurations/get-herb-sub-category-details-tab?id=' + id;
        return this.apiHttpService.GET(this.url);
    }
}

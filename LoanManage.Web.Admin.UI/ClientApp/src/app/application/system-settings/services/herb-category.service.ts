import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class HerbCategoryService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {
    }

    getDxGridHerbCategories(params: any) {
        this.url = 'herb/configurations/get-herb-categories';
        //return this.apiHttpService.GETDXGrid(this.url, params).toPromise();
        return this.apiHttpService.GETDXGrid(this.url, params);
    }

    getHerbCategories() {
        this.url = 'herb/configurations/get-herb-categories';
        return this.apiHttpService.GET(this.url);
    }

    getHerbCategorySelectItems(businessProfileId: number) {
        this.url = 'herb/configurations/get-herb-category-select-items/' + businessProfileId;
        return this.apiHttpService.GET(this.url);
    }

    getHerbCategory(id: any) {
        this.url = 'herb/configurations/get-herb-category?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    createHerbCategory(data: any) {
        this.url = 'herb/configurations/create-herb-category';
        return this.apiHttpService.POST(this.url, data);
    }

    updateHerbCategory(id: any, data: any) {
        this.url = 'herb/configurations/update-herb-category/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteHerbCategory(id: any) {
        this.url = 'herb/configurations/delete-herb-category/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteHerbCategories(ids: any[]) {
        this.url = 'herb/configurations/delete-herb-categories/';
        return this.apiHttpService.POST(this.url, ids);
    }

    getPageDetails(id: any) {
        this.url = 'herb/configurations/get-herb-category-details-tab?id=' + id;
        return this.apiHttpService.GET(this.url);
    }
}

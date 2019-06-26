import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class TypeAndCategoryService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getCustomCategoryTypes() {
        this.url = 'system-settings/custom-categories/get-custom-categories-types';
        return this.apiHttpService.GET(this.url);
    }

    getDxGridCustomCategories(routingKey: any, params: any) {

        this.url = 'system-settings/custom-categories/get-custom-category-list/' + routingKey;
        return this.apiHttpService.GETGridData(this.url, params);
    }

    getCustomCategoryById(id: any, categoryTypeKey: any, mapTypeId: any) {

        this.url = 'system-settings/custom-categories/get-custom-category?id=' + id + '&routingKey=' + categoryTypeKey + '&mapTypeId=1';
        return this.apiHttpService.GET(this.url);
    }

    getCustomCategoryTypeByKeyAsync(categoryTypeKey: any) {
        this.url = 'system-settings/custom-categories/get-custom-category-type-by-key/' + categoryTypeKey;
        return this.apiHttpService.GET(this.url);
    }

    moveUpCustomCategory(id: any) {
        this.url = 'system-settings/custom-categories/move-up/' + id;
        return this.apiHttpService.GET(this.url);
    }
    moveDownCustomCategory(id: any) {
        this.url = 'system-settings/custom-categories/move-down/' + id;
        return this.apiHttpService.GET(this.url);
    }

    createEntity(data: any) {
        this.url = 'system-settings/custom-categories/create-custom-category';
        return this.apiHttpService.POST(this.url, data);
    }

    updateEntity(id: any, data: any) {
        this.url = 'system-settings/custom-categories/update-custom-category/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteEntity(id: any) {
        this.url = 'system-settings/custom-categories/delete-custom-category/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteEntities(ids: any[]) {
        this.url = 'system-settings/custom-categories/delete-custom-categories/';
        return this.apiHttpService.POST(this.url, ids);
    }
}

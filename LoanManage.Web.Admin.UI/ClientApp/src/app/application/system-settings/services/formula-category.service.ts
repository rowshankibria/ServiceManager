import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class FormulaCategoryService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {
    }

    getDxGridFormulaCategories(params: any) {
        this.url = 'herb/configurations/get-formula-categories';
        //return this.apiHttpService.GETDXGrid(this.url, params).toPromise();
        return this.apiHttpService.GETDXGrid(this.url, params);
    }

    getFormulaCategories() {
        this.url = 'herb/configurations/get-formula-categories';
        return this.apiHttpService.GET(this.url);
    }

    getFormulaCategorySelectItems(businessProfileId: number) {
        this.url = 'herb/configurations/get-formula-category-select-items/' + businessProfileId;
        return this.apiHttpService.GET(this.url);
    }

    getFormulaCategory(id: any) {
        this.url = 'herb/configurations/get-formula-category?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    createFormulaCategory(data: any) {
        this.url = 'herb/configurations/create-formula-category';
        return this.apiHttpService.POST(this.url, data);
    }

    updateFormulaCategory(id: any, data: any) {
        this.url = 'herb/configurations/update-formula-category/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteFormulaCategory(id: any) {
        this.url = 'herb/configurations/delete-formula-category/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteFormulaCategories(ids: any[]) {
        this.url = 'herb/configurations/delete-formula-categories/';
        return this.apiHttpService.POST(this.url, ids);
    }

    getPageDetails(id: any) {
        this.url = 'herb/configurations/get-formula-category-details-tab?id=' + id;
        return this.apiHttpService.GET(this.url);
    }
}

import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class FormulaSubCategoryService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {
    }

    getDxGridFormulaSubcategories(params: any) {
        this.url = 'herb/configurations/get-formula-sub-categories';
        //return this.apiHttpService.GETDXGrid(this.url, params).toPromise();
        return this.apiHttpService.GETDXGrid(this.url, params);
    }

    getFormulaSubcategories() {
        this.url = 'herb/configurations/get-formula-sub-categories';
        return this.apiHttpService.GET(this.url);
    }

    getFormulabSubcategorySelectItems(businessProfileId: number) {
        this.url = 'herb/configurations/get-formula-sub-category-select-items/' + businessProfileId;
        return this.apiHttpService.GET(this.url);
    }

    getFormulaSubcategory(id: any) {
        this.url = 'herb/configurations/get-formula-sub-category?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getFormulasBySubcategory(formulaSubCategoryId: any, params: any) {
        this.url = 'herb/configurations/get-formulas-by-sub-category/' + formulaSubCategoryId;
        return this.apiHttpService.GETGridData(this.url, params);
    }

    createFormulaSubcategory(data: any) {
        this.url = 'herb/configurations/create-formula-sub-category';
        return this.apiHttpService.POST(this.url, data);
    }

    updateFormulaSubcategory(id: any, data: any) {
        this.url = 'herb/configurations/update-formula-sub-category/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteFormulaSubcategory(id: any) {
        this.url = 'herb/configurations/delete-formula-sub-category/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteFormulaSubcategories(ids: any[]) {
        this.url = 'herb/configurations/delete-formula-sub-categories/';
        return this.apiHttpService.POST(this.url, ids);
    }

    getPageDetails(id: any) {
        this.url = 'herb/configurations/get-formula-sub-category-details-tab?id=' + id;
        return this.apiHttpService.GET(this.url);
    }
}

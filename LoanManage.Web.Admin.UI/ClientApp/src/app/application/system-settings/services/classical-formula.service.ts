import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class ClassicalFormulaService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getClassicalFormula(id: any) {
        this.url = 'herb/configurations/get-classical-Formula?id=' + id;;
        return this.apiHttpService.GET(this.url);
    }

    createClassicalFormula(data: any) {
        this.url = 'herb/configurations/create-classical-formula';
        return this.apiHttpService.POST(this.url, data);
    }

    updateClassicalFormula(data: any) {
        this.url = 'herb/configurations/update-classical-formula';
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteClassicalFormula(id: any) {
        this.url = 'herb/configurations/delete-classical-formula/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteClassicalFormulaDetail(id: any) {
        this.url = 'herb/configurations/delete-classical-formula-detail/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteClassicalFormulas(ids: any[]) {
        this.url = 'herb/configurations/delete-classical-formulas/';
        return this.apiHttpService.POST(this.url, ids);
    }

    getAvailableHerbByFormulaId(formulaId: any, params: any) {
        this.url = 'herb/configurations/get-classical-formula-herb-available/' + formulaId;
        return this.apiHttpService.GETGridData(this.url, params);
    }

    getFormulaHerbByFormulaId(formulaId: any, params: any) {
        this.url = 'herb/configurations/get-classical-formula-herb-detail/' + formulaId;
        return this.apiHttpService.GETGridData(this.url, params);
    }
}

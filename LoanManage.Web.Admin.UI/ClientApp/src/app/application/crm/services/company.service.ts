import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class CompanyService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {
    }

    getDxGridCompanies(params: any) {
        this.url = 'crm/company/get-companies';
        //return this.apiHttpService.GETDXGrid(this.url, params).toPromise();
        return this.apiHttpService.GETDXGrid(this.url, params);
    }

    getCompanies() {
        this.url = 'crm/company/get-companies';
        return this.apiHttpService.GET(this.url);
    }

    getCompanySelectItems(businessProfileId: number) {
        this.url = 'crm/company/get-company-select-items/' + businessProfileId;
        return this.apiHttpService.GET(this.url);
    }

    getCompany(id: any) {
        this.url = 'crm/company/get-company?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    createCompany(data: any) {
        this.url = 'crm/company/create-company';
        return this.apiHttpService.POST(this.url, data);
    }

    updateCompany(id: any, data: any) {
        this.url = 'crm/company/update-company/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteCompany(id: any) {
        this.url = 'crm/company/delete-company/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteCompanies(ids: any[]) {
        this.url = 'crm/company/delete-companies/';
        return this.apiHttpService.POST(this.url, ids);
    }

    getStateByCountry(countryId: number) {
        this.url = 'crm/company/get-state-by-country/' + countryId;
        return this.apiHttpService.GET(this.url);
    }

    getPageDetails(id: any) {
        this.url = 'crm/company/get-company-details-tab/' + id;
        return this.apiHttpService.GET(this.url);
    }
}



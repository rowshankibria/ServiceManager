import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class SupplierService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {
    }

    getDxGridCompanies(params: any) {
        this.url = 'herb/supplier/get-suppliers';
        //return this.apiHttpService.GETDXGrid(this.url, params).toPromise();
        return this.apiHttpService.GETDXGrid(this.url, params);
    }

    getCompanies() {
        this.url = 'herb/supplier/get-suppliers';
        return this.apiHttpService.GET(this.url);
    }

    getCompanySelectItems(businessProfileId: number) {
        this.url = 'herb/supplier/get-supplier-select-items/' + businessProfileId;
        return this.apiHttpService.GET(this.url);
    }

    getCompany(id: any) {
        this.url = 'herb/supplier/get-supplier?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    createCompany(data: any) {
        this.url = 'herb/supplier/create-supplier';
        return this.apiHttpService.POST(this.url, data);
    }

    updateCompany(id: any, data: any) {
        this.url = 'herb/supplier/update-supplier/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteCompany(id: any) {
        this.url = 'herb/supplier/delete-supplier/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteCompanies(ids: any[]) {
        this.url = 'herb/supplier/delete-suppliers/';
        return this.apiHttpService.POST(this.url, ids);
    }

    getStateByCountry(countryId: number) {
        this.url = 'herb/supplier/get-state-by-country/' + countryId;
        return this.apiHttpService.GET(this.url);
    }

    getPageDetails(id: any) {
        this.url = 'herb/supplier/get-supplier-details-tab/' + id;
        return this.apiHttpService.GET(this.url);
    }
}



import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class ClinicService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {
    }

    getDxGridCompanies(params: any) {
        this.url = 'herb/clinic/get-clinics';
        //return this.apiHttpService.GETDXGrid(this.url, params).toPromise();
        return this.apiHttpService.GETDXGrid(this.url, params);
    }

    getCompanies() {
        this.url = 'herb/clinic/get-clinics';
        return this.apiHttpService.GET(this.url);
    }

    getCompanySelectItems(businessProfileId: number) {
        this.url = 'herb/clinic/get-clinic-select-items/' + businessProfileId;
        return this.apiHttpService.GET(this.url);
    }

    getCompany(id: any) {
        this.url = 'herb/clinic/get-clinic?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    createCompany(data: any) {
        this.url = 'herb/clinic/create-clinic';
        return this.apiHttpService.POST(this.url, data);
    }

    updateCompany(id: any, data: any) {
        this.url = 'herb/clinic/update-clinic/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteCompany(id: any) {
        this.url = 'herb/clinic/delete-clinic/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteCompanies(ids: any[]) {
        this.url = 'herb/clinic/delete-clinics/';
        return this.apiHttpService.POST(this.url, ids);
    }

    getStateByCountry(countryId: number) {
        this.url = 'herb/clinic/get-state-by-country/' + countryId;
        return this.apiHttpService.GET(this.url);
    }

    getPageDetails(id: any) {
        this.url = 'herb/clinic/get-clinic-details-tab/' + id;
        return this.apiHttpService.GET(this.url);
    }

    getContactByBusinessProfileDataSource(id: any) {        
        this.url = 'herb/clinic/get-contact-by-businessProfile/' + id;
        return this.apiHttpService.GET(this.url);
    }
}



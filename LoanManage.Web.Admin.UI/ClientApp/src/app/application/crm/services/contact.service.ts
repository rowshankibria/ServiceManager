import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../shared/services/api-http.service';

@Injectable()
export class ContactService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getDxGridRecords(id: any, params: any) {
        this.url = 'crm/contact/get-contact-company-list/' + id;
        return this.apiHttpService.GETDXGrid(this.url, params);
    }

    /**
     * get contact page details
     * @param id
     */
    getContactPageDetails(id: any) {
        this.url = 'crm/contact/get-contact-details-tab?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getContact(id: any) {
        this.url = 'crm/contact/get-contact?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    //getCompany(id: any) {
    //    this.url = 'crm/contact/get-contact-company-list/' + id;
    //    return this.apiHttpService.GET(this.url);
    //}

    getCompanyByBusinessProfile(ids: any[]) {
        
        this.url = 'crm/contact/get-contact-company-list';
        return this.apiHttpService.POST(this.url, ids);
    }

    createContact(fileName: any, data: any) {
        this.url = 'crm/contact/create-contact?imageFileName=' + fileName;
        return this.apiHttpService.POST(this.url, data);
    }

    updateContact(fileName: any, data: any) {
        this.url = 'crm/contact/update-contact?imageFileName=' + fileName;
        return this.apiHttpService.PUT(this.url, data);
    }
}

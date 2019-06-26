import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../shared/services/api-http.service';

@Injectable()
export class PractitionerService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getDxGridRecords(id: any, params: any) {
        this.url = 'herb/practitioner/get-practitioner-company-list/' + id;
        return this.apiHttpService.GETDXGrid(this.url, params);
    }

    /**
     * get contact page details
     * @param id
     */
    getContactPageDetails(id: any) {
        this.url = 'herb/practitioner/get-practitioner-details-tab?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getContact(id: any) {
        this.url = 'herb/practitioner/get-practitioner?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getCompanyByBusinessProfile(ids: any[]) {

        this.url = 'herb/practitioner/get-practitioner-company-list';
        return this.apiHttpService.POST(this.url, ids);
    }

    createContact(fileName: any, data: any) {
        this.url = 'herb/practitioner/create-practitioner?imageFileName=' + fileName;
        return this.apiHttpService.POST(this.url, data);
    }

    updateContact(fileName: any, data: any) {
        this.url = 'herb/practitioner/update-practitioner?imageFileName=' + fileName;
        return this.apiHttpService.PUT(this.url, data);
    }
}

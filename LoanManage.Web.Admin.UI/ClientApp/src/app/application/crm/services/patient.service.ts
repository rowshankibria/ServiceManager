import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../shared/services/api-http.service';

@Injectable()
export class PatientService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getDxGridRecords(id: any, params: any) {

        this.url = 'herb/patient/get-patient-company-list/' + id;
        return this.apiHttpService.GETDXGrid(this.url, params);
    }

    /**
     * get contact page details
     * @param id
     */
    getContactPageDetails(id: any) {
        this.url = 'herb/patient/get-patient-details-tab?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getBusinessProfileIdListByPractitionerId(id: any) {
        this.url = 'herb/patient/get-practitioner-businessprofile-list?id=' + id;
        return this.apiHttpService.GET(this.url);
    }
    

    getContact(id: any, practitionerId: any) {
        this.url = 'herb/patient/get-patient?id=' + id + '&practitionerId=' + practitionerId + '&isPortal=false';
        return this.apiHttpService.GET(this.url);
    }

    getCompanyByBusinessProfile(ids: any[]) {

        this.url = 'herb/patient/get-patient-company-list';
        return this.apiHttpService.POST(this.url, ids);
    }

    getPractitionerByBusinessProfile(ids: any[]) {

        this.url = 'herb/patient/get-practitioner-by-businessprofile-list';
        return this.apiHttpService.POST(this.url, ids);
    }

    createContact(fileName: any, data: any) {
        this.url = 'herb/patient/create-patient?imageFileName=' + fileName;
        return this.apiHttpService.POST(this.url, data);
    }

    updateContact(fileName: any, data: any) {
        this.url = 'herb/patient/update-patient?imageFileName=' + fileName;
        return this.apiHttpService.PUT(this.url, data);
    }
}

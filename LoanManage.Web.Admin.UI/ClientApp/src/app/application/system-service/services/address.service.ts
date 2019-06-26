import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class AddressService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {
    }


    getAddressListByUniqueEntityIdId(uniqueEntityId: string, recordId: number): any {
        this.url = 'application-service/address/get-address-list-by-entityid/' + uniqueEntityId + '/' + recordId;
        return this.apiHttpService.GET(this.url);
    }

    getAddressModelListByUniqueEntityIdId(uniqueEntityId: string, recordId: number): any {
        this.url = 'application-service/address/get-address-model-list-by-entityid/' + uniqueEntityId + '/' + recordId;
        return this.apiHttpService.GET(this.url);
    }


    getRecordInfoById(recordId: number, uniqueEntityId: string, entityId: number, businessProfileId: number): any {
        this.url = 'application-service/address/get-address-by-id/' + recordId + '/' + uniqueEntityId + '/' + entityId + '/' + businessProfileId;
        return this.apiHttpService.GET(this.url);
    }

    getInitAddressData(uniqueEntityId: string, businessProfileId: number): any {
        this.url = 'application-service/address/get-init-address-data/' + uniqueEntityId + '/' + businessProfileId;
        return this.apiHttpService.GET(this.url);
    }

    getSuburbList(): any {
        this.url = 'application-service/address-database/get-suburb';
        return this.apiHttpService.GET(this.url);
    }

    getStateList(countryId: number): any {
        this.url = 'application-service/address-database/get-state-by-country/' + countryId;
        return this.apiHttpService.GET(this.url);
    }

    createRecord(formDataSource: any): any {
        this.url = 'application-service/address/create-address';
        return this.apiHttpService.POST(this.url, formDataSource);
    }
     
    

    updateRecord(recordId: number, formDataSource: any): any {
        this.url = 'application-service/address/update-address/' + recordId;
        return this.apiHttpService.PUT(this.url, formDataSource);
    }

    deleteRecord(id: number,): any {
        this.url = 'application-service/address/delete-address-by-id/' + id;
        return this.apiHttpService.DELETE(this.url);
    }
}

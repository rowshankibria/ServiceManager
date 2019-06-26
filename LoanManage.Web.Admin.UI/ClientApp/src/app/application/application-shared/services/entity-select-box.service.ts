import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class EntitySelectBoxService {

   
    constructor(private apiHttpService: ApiHttpService) {
    }

    getEntitiesByBusinessProfileId(entityTypeId: number, businessProfileId: number) {

        let url = 'system-service/application-entity/get-entities/' + entityTypeId + '/' + businessProfileId;
       
        return this.apiHttpService.GET(url);
    }

    getCompaniesByBusinessProfileId(businessProfileId: number) {

        let url = 'system-service/application-entity/get-companies/' + businessProfileId;
       
        return this.apiHttpService.GET(url);
    }

    getContactsByBusinessProfileId(businessProfileId: number) {

        let url = 'system-service/application-entity/get-contacts/' + businessProfileId;
       
        return this.apiHttpService.GET(url);
    }

    getDataSource(serviceUrl: string) {
        
        return this.apiHttpService.GET(serviceUrl);
    }

}



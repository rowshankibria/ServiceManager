import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class EmailServerService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService)
    {

    }
     
  
    getRecordInfoById(recordId: number): any {
        this.url = 'system-settings/email-server/get-email-server/' + recordId;
        return this.apiHttpService.GET(this.url);
    }

    createRecord(formDataSource: any): any {
        this.url = 'system-settings/email-server/create-business-profile';
        return this.apiHttpService.POST(this.url, formDataSource);
    }

    updateRecord(recordId: number, formDataSource: any): any {
        this.url = 'system-settings/email-server/update-business-profile/' + recordId;
        return this.apiHttpService.PUT(this.url, formDataSource);
    }

}

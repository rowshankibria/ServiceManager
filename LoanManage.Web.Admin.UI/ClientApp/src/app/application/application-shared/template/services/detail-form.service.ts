import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class DetailFormService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {
    }

    getRecordInfoById(recordId: number): any {
        this.url = 'service-url/' + recordId;
        return this.apiHttpService.GET(this.url);
    }

    createRecord(formDataSource: any): any {
        this.url = 'service-url';
        return this.apiHttpService.POST(this.url, formDataSource);
    }

    updateRecord(recordId: number, formDataSource: any): any {
        this.url = 'service-url/' + recordId;
        return this.apiHttpService.PUT(this.url, formDataSource);
    }

     
}

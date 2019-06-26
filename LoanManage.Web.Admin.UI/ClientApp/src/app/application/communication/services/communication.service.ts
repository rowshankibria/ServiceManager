import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class CommunicationService
{
    url: string = '';
    constructor(private apiHttpService: ApiHttpService) {

    }

    getCommunication(id: any)
    {
        this.url = 'service/communication/get-communication/' + id;
        return this.apiHttpService.GET(this.url);
    }

    createCommnunication(data: any)
    {
        this.url = 'service/communication/create-communication';
        return this.apiHttpService.POST(this.url, data);
    }

    updateCommnunication(id:number, data: any)
    {
        this.url = 'service/communication/update-business-profile/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }
}

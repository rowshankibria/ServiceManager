import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class ListService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {
    }

    getPageInfoByRoutingUrl(routingUrl: any) {

        this.url = 'application-service/application-page/get-application-list-page-by-routing-url?routingUrl=' + routingUrl ;        
        return this.apiHttpService.GET(this.url);
    }

    getPageInfoByName(name: any) {

        this.url = 'application-service/application-page/get-application-list-page-by-name?name=' + name ;
        return this.apiHttpService.GET(this.url);
    }

    getDxGridRecords(url: any, params: any) {        
        return this.apiHttpService.GETDXGrid(url, params);
    }
    
    deleteRecord(url:any, id: any) {        
        return this.apiHttpService.DELETE(url + id);
    }

    deleteRecords(url:any, ids: any[]) {        
        return this.apiHttpService.POST(url, ids);
    }
}



import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class ApplicationMenuService {

    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {
    }

    getCurrentUserAppMenu() {        
        this.url = 'application-service/application-menu/get-application-menu';        
        return this.apiHttpService.GET(this.url);
    }

}



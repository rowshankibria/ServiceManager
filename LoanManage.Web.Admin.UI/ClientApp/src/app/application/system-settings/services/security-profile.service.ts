import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class SecurityProfileService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService)
    {
    }

    getDXGridSecurityProfiles(params: any)
    {
        this.url = 'system-settings/security-profile/get-security-profiles';
        return this.apiHttpService.GETDXGrid(this.url, params);
    }

    getById(id: any) {        
        this.url = 'system-settings/security-profile/get-security-profile/' + id;
        return this.apiHttpService.GET(this.url);
    }

    createEntity(data: any) {
        this.url = 'system-settings/security-profile/create-security-profile';
        return this.apiHttpService.POST(this.url, data);
    }

    updateEntity(id: any, data: any) {
        this.url = 'system-settings/security-profile/update-security-profile/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteEntity(id: any) {
        this.url = 'system-settings/security-profile/delete-security-profile/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteEntities(ids: any[]) {
        this.url = 'system-settings/security-profile/delete-security-profile/';
        return this.apiHttpService.POST(this.url, ids);
    }
}

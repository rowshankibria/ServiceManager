import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class SystemConfigurationService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService)
    {
    }

    getConfigurationMenu() {
        this.url = 'system-settings/configuration-menu/get-configurations-link-menu';
        return this.apiHttpService.GET(this.url);
    }

    getDefaultSecurityConfiguration() {

        this.url = 'system-settings/system-configuration/get-system-security-configuration';
        return this.apiHttpService.GET(this.url);
    }

    updateEntity(data: any) {        
        this.url = 'system-settings/system-configuration/update-system-security-configuration';
        return this.apiHttpService.PUT(this.url, data);
    }
}

import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class BusinessProfileService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService)
    {

    }

    getDXGridBusinessProfiles(params: any)
    {
        this.url = 'system-settings/business-profile/get-business-profiles';
        return this.apiHttpService.GETDXGrid(this.url, params).toPromise();
    }

    getBusinessProfilePageDetails(id: any)
    {
        this.url = 'system-settings/business-profile/get-business-profile-details?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getBusinessProfile(id: any) {
        this.url = 'system-settings/business-profile/get-business-profile?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    createBusinessProfiles(data: any) {
        this.url = 'system-settings/business-profile/create-business-profile';
        return this.apiHttpService.POST(this.url, data);
    }

    updateBusinessProfiles(businessProfileId: number, data: any) {
        this.url = 'system-settings/business-profile/update-business-profile/' + data.id;
        return this.apiHttpService.PUT(this.url, data);
    }
}

import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';
import { UserType } from '../../application-shared/components/titlebar/utilities';

@Injectable()
export class UserService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getUserList(params: any) {

        this.url = 'system-settings/users/get-active-user-list';
        return this.apiHttpService.GETGridData(this.url, params);
    }

    getUserDetailEntity(id: any) {
        //debugger;
        this.url = 'system-settings/users/get-user-detail?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getContactDetailForUserCreation(id: any) {
        this.url = 'system-settings/users/get-contact-for-user-detail?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    createUser(data: any) {
        this.url = 'system-settings/users/insert-user-detail';
        return this.apiHttpService.POST(this.url, data);
    }

    updateUser(id: any, data: any) {
        this.url = 'system-settings/users/update-user-detail/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteEntity(id: any) {
        this.url = 'system-settings/users/delete-user/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteEntities(ids: any[]) {
        this.url = 'system-settings/users/delete-users/';
        return this.apiHttpService.POST(this.url, ids);
    }

    getEntitiesDataSource(userType: any) {
        let url = '';
       // if (userType == UserType.Employee) {
            url = 'system-settings/users/get-entity-on-usertype';
        //}

        return this.apiHttpService.POST(url, userType);
    }

    changePassword(data: any) {
        let url = 'application-service/account/change-password';
        return this.apiHttpService.POST(url, data);
    }

    getChangePassword() {
        let url = 'application-service/account/get-change-password';
        return this.apiHttpService.GET(url);
    }
}

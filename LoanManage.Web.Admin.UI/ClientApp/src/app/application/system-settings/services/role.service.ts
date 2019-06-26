import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';

@Injectable()
export class RoleService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getRoleList() {

        this.url = 'system-settings/roles/get-active-role-list';
        return this.apiHttpService.GET(this.url);
    }

    getRole(id: any)
    {
        this.url = 'system-settings/roles/get-role?id=' + id;;
        return this.apiHttpService.GET(this.url);
    }

    createRole(data: any)
    {
        this.url = 'system-settings/roles/create-role';
        return this.apiHttpService.POST(this.url, data);
    }

    updateRole(id: any, data: any) {
        this.url = 'system-settings/roles/update-role/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteEntity(id: any) {
        this.url = 'system-settings/roles/delete-custom-category/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteEntities(ids: any[]) {
        this.url = 'system-settings/roles/delete-custom-categories/';
        return this.apiHttpService.POST(this.url, ids);
    }

    getUserByRoleList(roleId: string, params: any)
    {
        this.url = 'system-settings/roles/get-user-role-list/' + roleId;
        return this.apiHttpService.GETGridData(this.url, params);
    }
    
    getUserPermissionList(parentRoleId: any)
    {
        this.url = 'system-settings/roles/get-user-permission-list/' + parentRoleId;
        return this.apiHttpService.GET(this.url);
    }

    getPermissionListByRole(ids: any[]) {        
        this.url = 'system-settings/roles/get-role-right-list';
        return this.apiHttpService.POST(this.url, ids);
    }
}

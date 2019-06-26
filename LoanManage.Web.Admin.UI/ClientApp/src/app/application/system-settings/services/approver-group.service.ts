import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service';
import { Observable } from 'rxjs';

@Injectable()
export class ApproverGroupService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getApproverGroup(id: any) {
        this.url = 'loan/configurations/get-approver-group-detail?id=' + id;;
        return this.apiHttpService.GET(this.url);
    }

    createApproverGroup(data: any) {
        this.url = 'loan/configurations/create-approver-group';
        return this.apiHttpService.POST(this.url, data);
    }    

    updateApproverGroup(data: any) {
        this.url = 'loan/configurations/update-approver-group';
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteApproverGroup(id: any) {
        this.url = 'loan/configurations/delete-approver-group/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    getEmployeeByApproverEntityType(id: any) {

        this.url = 'loan/configurations/get-approver-group-by-entity-type/' + id;
        return this.apiHttpService.GET(this.url);
    }
}

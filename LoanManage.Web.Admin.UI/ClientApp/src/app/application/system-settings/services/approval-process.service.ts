import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service';
import { Observable } from 'rxjs';

@Injectable()
export class ApprovalProcessService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getApprovalProcess(id: any) {
        this.url = 'loan/configurations/get-approval-process-detail?id=' + id;;
        return this.apiHttpService.GET(this.url);
    }

    getApprovalProcessStepByApprovalProcessIdList(appProcessId: string, params: any) {
        this.url = 'loan/configurations/get-approval-process-list/' + appProcessId;
        return this.apiHttpService.GETGridData(this.url, params);
    }

    moveUp(id: any) {
        this.url = 'loan/configurations/move-up/' + id;
        return this.apiHttpService.GET(this.url);
    }
    moveDown(id: any) {
        this.url = 'loan/configurations/move-down/' + id;
        return this.apiHttpService.GET(this.url);
    }

    createApprovalProcess(data: any) {
        this.url = 'loan/configurations/create-approval-process';
        return this.apiHttpService.POST(this.url, data);
    }

    createApprovalProcessStep(data: any) {
        this.url = 'loan/configurations/create-approval-process-step';
        return this.apiHttpService.POST(this.url, data);
    }

    updateApprovalProcess(data: any) {
        this.url = 'loan/configurations/update-approval-process';
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteApprovalProcess(id: any) {
        this.url = 'loan/configurations/delete-approval-process/' + id;
        return this.apiHttpService.DELETE(this.url);
    }   
}

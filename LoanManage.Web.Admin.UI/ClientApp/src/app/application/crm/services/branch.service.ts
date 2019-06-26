import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service';
import { Observable } from 'rxjs';

@Injectable()
export class BranchService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getBranch(id: any) {
        this.url = 'crm/branch/get-branch-detail?id=' + id;;
        return this.apiHttpService.GET(this.url);
    }

    createBranch(data: any) {
        this.url = 'crm/branch/create-branch';
        return this.apiHttpService.POST(this.url, data);
    }
 

    updateBranch(data: any) {
        this.url = 'crm/branch/update-branch';
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteBranch(id: any) {
        this.url = 'crm/branch/delete-branch/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteBranches(ids: any[]) {
        this.url = 'crm/branch/delete-branches';
        return this.apiHttpService.POST(this.url, ids);
    }
}

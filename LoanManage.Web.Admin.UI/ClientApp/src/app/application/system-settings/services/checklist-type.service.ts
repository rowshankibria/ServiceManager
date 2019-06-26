import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service';
import { Observable } from 'rxjs';

@Injectable()
export class ChecklistService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getChecklistType(id: any) {
        this.url = 'loan/configurations/get-checklist-detail?id=' + id;;
        return this.apiHttpService.GET(this.url);
    }

    createChecklistType(data: any) {
        this.url = 'loan/configurations/create-checklisttype';
        return this.apiHttpService.POST(this.url, data);
    }

    updateChecklistType(data: any) {
        this.url = 'loan/configurations/update-checklisttype';
        return this.apiHttpService.PUT(this.url, data);
    }

    deleteChecklistType(id: any) {
        this.url = 'loan/configurations/delete-checklisttype/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteChecklistTypes(ids: any[]) {
        this.url = 'loan/configurations/delete-checklisttypes';
        return this.apiHttpService.POST(this.url, ids);
    }
    
}

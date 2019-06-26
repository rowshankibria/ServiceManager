import { Injectable } from '@angular/core';
import { ApiHttpService } from './api-url.service';

@Injectable()
export class LoanApplicationService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }    
   

    getApplication(id: any) {
        this.url = 'loan/loanApplication/get-application-detail?id=' + id;
        return this.apiHttpService.GET(this.url);
    }   

   
    createApplication(fileName: any, data: any) {
        this.url = 'loan/loanApplication/create-application';
        return this.apiHttpService.POST(this.url, data);
    }

    updateApplication(fileName: any, data: any) {
        this.url = 'loan/loanApplication/update-application';
        return this.apiHttpService.PUT(this.url, data);
    }
}

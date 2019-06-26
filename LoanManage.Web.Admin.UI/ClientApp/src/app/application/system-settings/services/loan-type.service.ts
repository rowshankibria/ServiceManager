import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service';
import { Observable } from 'rxjs';

@Injectable()
export class LoanTypeService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getLoanType(id: any) {
        this.url = 'loan/configurations/get-loantyle-detail?id=' + id;;
        return this.apiHttpService.GET(this.url);
    }

    getCustomFieldDetail(id: any) {
        this.url = 'loan/configurations/get-custom-field-detail/' + id;;
        return this.apiHttpService.GET(this.url);
    }

    getCustomFieldsByLoanType(id: any) {
        this.url = 'loan/configurations/get-custom-fields-by-loantype/' + id;;
        return this.apiHttpService.GET(this.url);
    }

    createLoanType(data: any) {
        this.url = 'loan/configurations/create-loantype';
        return this.apiHttpService.POST(this.url, data);
    }

    createLoanTypeCustomField(data: any) {
        this.url = 'loan/configurations/create-loantype-custom-field';
        return this.apiHttpService.POST(this.url, data);
    }

    updateLoanType(data: any) {
        this.url = 'loan/configurations/update-loantype';
        return this.apiHttpService.PUT(this.url, data);
    }

    updateCustomField(data: any) {
        this.url = 'loan/configurations/update-custom-field';
        return this.apiHttpService.POST(this.url, data);
    }

    updateGroupOrFieldOrder(loanTypeId: number, groupName: string, controlId: number, isDown: boolean, isGroupSort: boolean) {
        this.url = 'loan/configurations/update-group-or-field-order/' + loanTypeId + "/" + groupName + "/" + controlId + "/" + isDown + "/" + isGroupSort;
        return this.apiHttpService.POST(this.url, null);
    }

    updateGroup(data: any) {
        this.url = 'loan/configurations/update-group';
        return this.apiHttpService.POST(this.url, data);
    }

    deleteLoanType(id: any) {
        this.url = 'loan/configurations/delete-loantype/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteLoanTypes(ids: any[]) {
        this.url = 'loan/configurations/delete-loantype';
        return this.apiHttpService.POST(this.url, ids);
    }

    getLoanTypeCustomFieldByLoanTypeId(loanTypeId: any, params: any) {
        this.url = 'loan/configurations/get-customfields-loantype/' + loanTypeId;
        return this.apiHttpService.GETGridData(this.url, params);
    }

    deleteLoanTypeCustomFieldDetail(id: any) {
        this.url = 'loan/configurations/delete-custom-field/' + id;
        return this.apiHttpService.DELETE(this.url);
    }
}

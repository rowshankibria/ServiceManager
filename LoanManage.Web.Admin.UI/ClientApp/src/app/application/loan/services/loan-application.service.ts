import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service';
import { Observable } from 'rxjs';
import saveAs from 'file-saver';

@Injectable()
export class LoanApplicationService {
    url: string = '';

    constructor(private apiHttpService: ApiHttpService) {

    }

    getApplication(id: any) {
        this.url = 'loan/loanApplication/get-application-detail-admin?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getApplicationChecklist(id: any) {
        this.url = 'loan/loanApplication/get-application-checklist?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getApplicationUserNoteList(id: any) {
        this.url = 'loan/loanApplication/get-application-user-notelist?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getApplicationSystemNoteList(id: any) {
        this.url = 'loan/loanApplication/get-application-system-notelist?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getApplicationQANoteList(id: any) {
        this.url = 'loan/loanApplication/get-application-qa-notelist?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getLoanApplicationPageDetails(id: any) {
        this.url = 'loan/loanApplication/get-application-detail-tab?id=' + id;
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

    updateChecklist(data: any[]) {
        this.url = 'loan/loanApplication/update-checklist';
        return this.apiHttpService.PUT(this.url, data);
    }

    updateUserNoteList(data: any[]) {
        this.url = 'loan/loanApplication/update-user-notelist';
        return this.apiHttpService.PUT(this.url, data);
    }

    updateSystemNoteList(data: any[]) {
        this.url = 'loan/loanApplication/update-system-notelist';
        return this.apiHttpService.PUT(this.url, data);
    }

    updateQANoteList(data: any[]) {
        this.url = 'loan/loanApplication/update-qa-notelist';
        return this.apiHttpService.PUT(this.url, data);
    }

    mapApplicationToApprovalProcess(data: any) {
        this.url = 'loan/loanApplication/mapping-application';
        return this.apiHttpService.POST(this.url, data);
    }

    acceptApprovalProcess(entityId: any, mappingId: any) {
        this.url = 'loan/loanApplication/accept-application/' + entityId + '/' + mappingId;
        return this.apiHttpService.GET(this.url);
    }

    rejectApprovalProcess(entityId: any, mappingId: any) {
        this.url = 'loan/loanApplication/reject-application/' + entityId + '/' + mappingId;
        return this.apiHttpService.GET(this.url);
    }

    submitToCreditAdministrator(entityId: any) {
        this.url = 'loan/loanApplication/submit-credit-admin/' + entityId;
        return this.apiHttpService.GET(this.url);
    }

    getDashboardApplication() {
        this.url = 'loan/loanApplication/get-dashboard';
        return this.apiHttpService.GET(this.url);
    }

    uploadDocumentList(id: any, data: any[]) {
        this.url = 'loan/loanApplication/upload-application-documents/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }

    getApplicationDocumentList(id: any) {
        this.url = 'loan/loanApplication/get-application-documents?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    getApplicationLoanDocumentCategory(id: any) {
        this.url = 'loan/loanApplication/get-application-document-category?id=' + id;
        return this.apiHttpService.GET(this.url);
    }

    downloadLatestFile(id: any, fileName: any) {

        this.url = 'loan/loanApplication/download-lastest-file/' + id;
        this.apiHttpService.DownloadFile(this.url).subscribe(data => {
            var blob = new Blob([data], { type: data.type });
            saveAs(blob, fileName);
        })

    }

    deleteNoteRecord(id: any) {
        this.url = 'loan/loanApplication/delete-note/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

    deleteDocumentRecord(id: any) {
        this.url = 'loan/loanApplication/delete-document/' + id;
        return this.apiHttpService.DELETE(this.url);
    }

}

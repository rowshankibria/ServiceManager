"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var file_saver_1 = require("file-saver");
var LoanApplicationService = /** @class */ (function () {
    function LoanApplicationService(apiHttpService) {
        this.apiHttpService = apiHttpService;
        this.url = '';
    }
    LoanApplicationService.prototype.getApplication = function (id) {
        this.url = 'loan/loanApplication/get-application-detail-admin?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    LoanApplicationService.prototype.getApplicationChecklist = function (id) {
        this.url = 'loan/loanApplication/get-application-checklist?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    LoanApplicationService.prototype.getApplicationUserNoteList = function (id) {
        this.url = 'loan/loanApplication/get-application-user-notelist?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    LoanApplicationService.prototype.getApplicationSystemNoteList = function (id) {
        this.url = 'loan/loanApplication/get-application-system-notelist?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    LoanApplicationService.prototype.getApplicationQANoteList = function (id) {
        this.url = 'loan/loanApplication/get-application-qa-notelist?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    LoanApplicationService.prototype.getLoanApplicationPageDetails = function (id) {
        this.url = 'loan/loanApplication/get-application-detail-tab?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    LoanApplicationService.prototype.createApplication = function (fileName, data) {
        this.url = 'loan/loanApplication/create-application';
        return this.apiHttpService.POST(this.url, data);
    };
    LoanApplicationService.prototype.updateApplication = function (fileName, data) {
        this.url = 'loan/loanApplication/update-application';
        return this.apiHttpService.PUT(this.url, data);
    };
    LoanApplicationService.prototype.updateChecklist = function (data) {
        this.url = 'loan/loanApplication/update-checklist';
        return this.apiHttpService.PUT(this.url, data);
    };
    LoanApplicationService.prototype.updateUserNoteList = function (data) {
        this.url = 'loan/loanApplication/update-user-notelist';
        return this.apiHttpService.PUT(this.url, data);
    };
    LoanApplicationService.prototype.updateSystemNoteList = function (data) {
        this.url = 'loan/loanApplication/update-system-notelist';
        return this.apiHttpService.PUT(this.url, data);
    };
    LoanApplicationService.prototype.updateQANoteList = function (data) {
        this.url = 'loan/loanApplication/update-qa-notelist';
        return this.apiHttpService.PUT(this.url, data);
    };
    LoanApplicationService.prototype.mapApplicationToApprovalProcess = function (data) {
        this.url = 'loan/loanApplication/mapping-application';
        return this.apiHttpService.POST(this.url, data);
    };
    LoanApplicationService.prototype.acceptApprovalProcess = function (entityId, mappingId) {
        this.url = 'loan/loanApplication/accept-application/' + entityId + '/' + mappingId;
        return this.apiHttpService.GET(this.url);
    };
    LoanApplicationService.prototype.rejectApprovalProcess = function (entityId, mappingId) {
        this.url = 'loan/loanApplication/reject-application/' + entityId + '/' + mappingId;
        return this.apiHttpService.GET(this.url);
    };
    LoanApplicationService.prototype.submitToCreditAdministrator = function (entityId) {
        this.url = 'loan/loanApplication/submit-credit-admin/' + entityId;
        return this.apiHttpService.GET(this.url);
    };
    LoanApplicationService.prototype.getDashboardApplication = function () {
        this.url = 'loan/loanApplication/get-dashboard';
        return this.apiHttpService.GET(this.url);
    };
    LoanApplicationService.prototype.uploadDocumentList = function (id, data) {
        this.url = 'loan/loanApplication/upload-application-documents/' + id;
        return this.apiHttpService.PUT(this.url, data);
    };
    LoanApplicationService.prototype.getApplicationDocumentList = function (id) {
        this.url = 'loan/loanApplication/get-application-documents?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    LoanApplicationService.prototype.getApplicationLoanDocumentCategory = function (id) {
        this.url = 'loan/loanApplication/get-application-document-category?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    LoanApplicationService.prototype.downloadLatestFile = function (id, fileName) {
        this.url = 'loan/loanApplication/download-lastest-file/' + id;
        this.apiHttpService.DownloadFile(this.url).subscribe(function (data) {
            var blob = new Blob([data], { type: data.type });
            file_saver_1.default(blob, fileName);
        });
    };
    LoanApplicationService.prototype.deleteNoteRecord = function (id) {
        this.url = 'loan/loanApplication/delete-note/' + id;
        return this.apiHttpService.DELETE(this.url);
    };
    LoanApplicationService.prototype.deleteDocumentRecord = function (id) {
        this.url = 'loan/loanApplication/delete-document/' + id;
        return this.apiHttpService.DELETE(this.url);
    };
    LoanApplicationService = __decorate([
        core_1.Injectable()
    ], LoanApplicationService);
    return LoanApplicationService;
}());
exports.LoanApplicationService = LoanApplicationService;
//# sourceMappingURL=loan-application.service.js.map
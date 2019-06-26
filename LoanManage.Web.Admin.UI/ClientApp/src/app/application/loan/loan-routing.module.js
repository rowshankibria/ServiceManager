"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var list_component_1 = require("./../application-shared/components/list/list.component");
var loan_component_1 = require("./loan.component");
var application_form_component_1 = require("./components/application-form.component");
var loan_application_detail_component_1 = require("./components/loan-application-detail.component");
var checklist_component_1 = require("./components/checklist.component");
var note_component_1 = require("./components/note.component");
var fileuploader_component_1 = require("./components/fileuploader.component");
var fileuploader_form_component_1 = require("./components/fileuploader-form.component");
var note_system_component_1 = require("./components/note-system.component");
var note_qa_component_1 = require("./components/note-qa.component");
var routes = [{
        path: '', component: loan_component_1.LoanComponent,
        children: [
            { path: 'applications', component: list_component_1.ListComponent, data: { title: 'Applications' } },
            { path: 'submitApplications', component: list_component_1.ListComponent, data: { title: 'Submit Applications' } },
            { path: 'application', component: loan_application_detail_component_1.LoanApplicationDetailComponent, data: { title: 'New Application' } },
            { path: 'application/:applicationId', component: loan_application_detail_component_1.LoanApplicationDetailComponent, data: { title: 'Application Detail' } },
        ],
    }];
var LoanRoutingModule = /** @class */ (function () {
    function LoanRoutingModule() {
    }
    LoanRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], LoanRoutingModule);
    return LoanRoutingModule;
}());
exports.LoanRoutingModule = LoanRoutingModule;
exports.RoutedComponents = [
    loan_component_1.LoanComponent,
    application_form_component_1.ApplicationDetailsComponent,
    loan_application_detail_component_1.LoanApplicationDetailComponent,
    checklist_component_1.ChecklistComponent,
    note_component_1.NoteComponent,
    note_system_component_1.NoteSystemComponent,
    note_qa_component_1.NoteQAComponent,
    fileuploader_component_1.FileUploaderComponent,
    fileuploader_form_component_1.FileUploaderFormComponent
];
//# sourceMappingURL=loan-routing.module.js.map
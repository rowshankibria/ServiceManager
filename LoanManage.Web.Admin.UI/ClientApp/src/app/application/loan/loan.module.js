"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var loan_routing_module_1 = require("./loan-routing.module");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var core_2 = require("@ngx-translate/core");
var devextreme_angular_1 = require("devextreme-angular");
//import application modules
var application_shared_module_1 = require("./../application-shared/application-shared.module");
var system_service_module_1 = require("./../system-service/system-service.module");
var loan_application_service_1 = require("./services/loan-application.service");
var angular_nepali_datepicker_1 = require("angular-nepali-datepicker");
var LoanModule = /** @class */ (function () {
    function LoanModule() {
    }
    LoanModule = __decorate([
        core_1.NgModule({
            imports: [loan_routing_module_1.LoanRoutingModule,
                forms_1.FormsModule,
                common_1.CommonModule,
                core_2.TranslateModule,
                forms_1.ReactiveFormsModule,
                devextreme_angular_1.DxToolbarModule,
                devextreme_angular_1.DxTabPanelModule,
                devextreme_angular_1.DxCheckBoxModule,
                devextreme_angular_1.DxTemplateModule,
                devextreme_angular_1.DxDataGridModule,
                application_shared_module_1.ApplicationSharedModule,
                system_service_module_1.SystemServiceModule,
                devextreme_angular_1.DxToolbarModule,
                devextreme_angular_1.DxSelectBoxModule,
                devextreme_angular_1.DxTextAreaModule,
                devextreme_angular_1.DxDateBoxModule,
                devextreme_angular_1.DxFormModule,
                devextreme_angular_1.DxNumberBoxModule,
                devextreme_angular_1.DxTextBoxModule,
                devextreme_angular_1.DxValidatorModule,
                application_shared_module_1.ApplicationSharedModule,
                devextreme_angular_1.DxValidationGroupModule,
                devextreme_angular_1.DxColorBoxModule,
                devextreme_angular_1.DxMultiViewModule,
                devextreme_angular_1.DxRadioGroupModule,
                devextreme_angular_1.DxTreeListModule,
                devextreme_angular_1.DxFileUploaderModule,
                devextreme_angular_1.DxTagBoxModule,
                devextreme_angular_1.DxDropDownBoxModule,
                devextreme_angular_1.DxButtonModule,
                angular_nepali_datepicker_1.NpDatepickerModule
            ],
            exports: [],
            declarations: loan_routing_module_1.RoutedComponents.slice(),
            providers: [
                loan_application_service_1.LoanApplicationService
            ]
        })
    ], LoanModule);
    return LoanModule;
}());
exports.LoanModule = LoanModule;
//# sourceMappingURL=loan.module.js.map
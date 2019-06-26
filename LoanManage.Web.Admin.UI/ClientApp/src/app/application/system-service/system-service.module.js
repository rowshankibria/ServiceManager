"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var core_2 = require("@ngx-translate/core");
var devextreme_angular_1 = require("devextreme-angular");
var application_shared_module_1 = require("./../application-shared/application-shared.module");
var address_form_component_1 = require("./components/address/address-form.component");
var inline_address_component_1 = require("./components/address/inline-address.component");
var address_service_1 = require("./services/address.service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var router_1 = require("@angular/router");
var SystemServiceModule = /** @class */ (function () {
    function SystemServiceModule() {
    }
    SystemServiceModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                devextreme_angular_1.DxToolbarModule,
                devextreme_angular_1.DxDataGridModule,
                devextreme_angular_1.DxCheckBoxModule,
                router_1.RouterModule,
                core_2.TranslateModule,
                ng_bootstrap_1.NgbModule,
                devextreme_angular_1.DxFileUploaderModule,
                devextreme_angular_1.DxDropDownBoxModule,
                devextreme_angular_1.DxValidatorModule,
                devextreme_angular_1.DxValidationGroupModule,
                devextreme_angular_1.DxSelectBoxModule,
                devextreme_angular_1.DxTextBoxModule,
                devextreme_angular_1.DxAutocompleteModule,
                application_shared_module_1.ApplicationSharedModule,
                devextreme_angular_1.DxButtonModule
            ],
            exports: [
                address_form_component_1.AddressComponent,
                inline_address_component_1.InlineAddressComponent
            ],
            declarations: [
                address_form_component_1.AddressComponent,
                inline_address_component_1.InlineAddressComponent
            ],
            providers: [
                address_service_1.AddressService
            ]
        })
    ], SystemServiceModule);
    return SystemServiceModule;
}());
exports.SystemServiceModule = SystemServiceModule;
//# sourceMappingURL=system-service.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var titlebar_component_1 = require("./components/titlebar/titlebar.component");
var sidebar_component_1 = require("./components/sidebar/sidebar.component");
var header_component_1 = require("./components/header/header.component");
var image_upload_component_1 = require("./components/common/image-upload.component");
var devextreme_angular_1 = require("devextreme-angular");
var router_1 = require("@angular/router");
var core_2 = require("@ngx-translate/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var list_service_1 = require("./services/list.service");
var entity_select_box_service_1 = require("./services/entity-select-box.service");
var application_menu_service_1 = require("./services/application-menu.service");
var list_component_1 = require("./components/list/list.component");
var app_entity_select_box_component_1 = require("./components/common/app-entity-select-box.component");
var template_detail_form_component_1 = require("./template/detail-page/template-detail-form.component");
var forms_1 = require("@angular/forms");
var ApplicationSharedModule = /** @class */ (function () {
    function ApplicationSharedModule() {
    }
    ApplicationSharedModule = __decorate([
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
                devextreme_angular_1.DxValidationGroupModule
            ],
            declarations: [
                titlebar_component_1.TitlebarComponent,
                sidebar_component_1.SidebarComponent,
                header_component_1.HeaderComponent,
                list_component_1.ListComponent,
                app_entity_select_box_component_1.EntitySelectBoxComponent,
                image_upload_component_1.ImageUploadComponent,
                template_detail_form_component_1.TemplateDetailFormComponent
            ],
            exports: [
                titlebar_component_1.TitlebarComponent,
                sidebar_component_1.SidebarComponent,
                header_component_1.HeaderComponent,
                list_component_1.ListComponent,
                app_entity_select_box_component_1.EntitySelectBoxComponent,
                image_upload_component_1.ImageUploadComponent,
                template_detail_form_component_1.TemplateDetailFormComponent
            ],
            providers: [
                list_service_1.ListService,
                entity_select_box_service_1.EntitySelectBoxService,
                application_menu_service_1.ApplicationMenuService
            ]
        })
    ], ApplicationSharedModule);
    return ApplicationSharedModule;
}());
exports.ApplicationSharedModule = ApplicationSharedModule;
//# sourceMappingURL=application-shared.module.js.map
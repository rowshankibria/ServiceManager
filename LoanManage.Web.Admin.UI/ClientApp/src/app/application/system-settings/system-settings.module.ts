import { NgModule } from '@angular/core';
import { SystemSettingsRoutingModule, RoutedComponents } from './system-settings-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxToolbarModule, DxDataGridModule, DxSelectBoxModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule, DxColorBoxModule, DxMultiViewModule, DxRadioGroupModule, DxTreeListModule, DxFileUploaderModule, DxTagBoxModule, DxDropDownBoxModule } from 'devextreme-angular';

//import application modules
import { ApplicationSharedModule } from './../application-shared/application-shared.module';
import { SystemServiceModule } from './../system-service/system-service.module'

//import currernt module components
import { ConfigurationComponent } from './components/configurations/configuration-menu.component';
import { DocumentExtensionsComponent } from './components/configurations/system-configuration/document-extension/document-extensions.component';
import { DocumentExtensionFormComponent } from './components/configurations/system-configuration/document-extension/document-extension-form.component';
import { EmailServersComponent } from './components/configurations/system-configuration/email-server/email-servers.component';
import { EmailServerFormComponent } from './components/configurations/system-configuration/email-server/email-server-form.component';
import { SecurityConfigurationComponent } from './components/configurations/system-configuration/security-configuration.component';
import { SecurityProfilesFormComponent } from './components/configurations/system-configuration/security-profile/security-profiles-form.component';
import { SecurityPolicyComponent } from './components/configurations/system-configuration/security-profile/security-policy.component';
import { PasswordSettingComponent } from './components/configurations/system-configuration/security-profile/password-setting.component';
import { SessionAccessControlComponent } from './components/configurations/system-configuration/security-profile/session-access-control.component';
import { TypeAndCategoryComponent } from './components/type-categories/type-and-category-menu.component';
import { CustomCategoriesComponent } from './components/type-categories/custom-categories.component';
import { CustomCategoryFormComponent } from "./components/type-categories/custom-category-form.component";
import { UserFormComponent } from "./components/users/user-form.component";
import { RoleFormComponent } from './components/roles/role-form.component';

//import current module services
import { EmailServerService } from './services/email-server.service'
import { SecurityProfileService } from './services/security-profile.service'
import { SystemConfigurationService } from './services/system-configuration.service'
import { BusinessProfileService } from './services/business-profile.service'
import { TypeAndCategoryService } from './services/type-and-category.service'
import { RoleService } from './services/role.service'
import { UserService } from './services/user.service'
import { HerbCategoryService } from './services/herb-category.service'
import { FormulaCategoryService } from './services/formula-category.service'
import { HerbSubCategoryService } from './services/herb-sub-category.service'
import { FormulaSubCategoryService } from './services/formula-sub-category.service'
import { ClassicalFormulaService } from './services/classical-formula.service';
import { LoanTypeService } from './services/loan-type.service';
import { ApproverGroupService } from './services/approver-group.service';
import { ApprovalProcessService } from './services/approval-process.service';
import { ChecklistService } from './services/checklist-type.service';

@NgModule({
    imports: [SystemSettingsRoutingModule,
        FormsModule
        , CommonModule
        , TranslateModule
        , ReactiveFormsModule
        , DxToolbarModule
        , DxTabPanelModule
        , DxCheckBoxModule
        , DxTemplateModule
        , DxDataGridModule
        , ApplicationSharedModule
        , SystemServiceModule
        , DxToolbarModule
        , DxSelectBoxModule
        , DxTextAreaModule
        , DxDateBoxModule
        , DxFormModule
        , DxNumberBoxModule
        , DxTextBoxModule
        , DxValidatorModule
        , ApplicationSharedModule
        , DxValidationGroupModule
        , DxColorBoxModule        
        , DxMultiViewModule
        , DxRadioGroupModule
        , DxTreeListModule
        , DxFileUploaderModule
        , DxTagBoxModule
        , DxDropDownBoxModule
        , DxButtonModule        
    ],
    exports: [
        ConfigurationComponent
        , DocumentExtensionsComponent
        , DocumentExtensionFormComponent
        , EmailServersComponent
        , EmailServerFormComponent
        , SecurityConfigurationComponent
        , SecurityPolicyComponent
        
        , PasswordSettingComponent
        , SessionAccessControlComponent
        , SecurityProfilesFormComponent
        , TypeAndCategoryComponent
        , CustomCategoriesComponent
        , CustomCategoryFormComponent
        , UserFormComponent
        , RoleFormComponent
    ],
    declarations: [
        ...RoutedComponents
    ],
    providers: [
        EmailServerService
        , SecurityProfileService
        , SystemConfigurationService
        , BusinessProfileService
        , TypeAndCategoryService
        , UserService
        , RoleService
        , HerbCategoryService
        , FormulaCategoryService
        , HerbSubCategoryService
        , FormulaSubCategoryService
        , ClassicalFormulaService
        , LoanTypeService
        , ApproverGroupService
        , ApprovalProcessService
        , ChecklistService
    ]
})
export class SystemSettingsModule
{
}

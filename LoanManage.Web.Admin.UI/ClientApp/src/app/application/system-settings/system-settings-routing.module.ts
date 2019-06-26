import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigurationComponent } from './components/configurations/configuration-menu.component';
import { SystemConfigurationComponent } from './components/configurations/system-configuration/system-configuration.component';
import { SecurityConfigurationComponent } from './components/configurations/system-configuration/security-configuration.component';
import { DocumentExtensionsComponent } from './components/configurations/system-configuration/document-extension/document-extensions.component';
import { DocumentExtensionFormComponent } from './components/configurations/system-configuration/document-extension/document-extension-form.component';
import { EmailServersComponent } from './components/configurations/system-configuration/email-server/email-servers.component';
import { EmailServerFormComponent } from './components/configurations/system-configuration/email-server/email-server-form.component';

import { SecurityProfilesFormComponent } from "./components/configurations/system-configuration/security-profile/security-profiles-form.component";
import { SecurityPolicyComponent } from "./components/configurations/system-configuration/security-profile/security-policy.component";
import { PasswordSettingComponent } from "./components/configurations/system-configuration/security-profile/password-setting.component";
import { SessionAccessControlComponent } from "./components/configurations/system-configuration/security-profile/session-access-control.component";
import { SystemSettingsComponent } from "./system-settings.component";
import { BusinessProfilesComponent } from "./components/business-profiles/business-profiles.component";
import { BusinessProfileDetailsComponent } from "./components/business-profiles/business-profile-details.component";
import { BusinessProfileGeneralInformationComponent } from "./components/business-profiles/business-profile-general-information.component";
import { TypeAndCategoryComponent } from "./components/type-categories/type-and-category-menu.component";
import { CustomCategoriesComponent } from "./components/type-categories/custom-categories.component";
import { CustomCategoryFormComponent } from "./components/type-categories/custom-category-form.component";
import { UserFormComponent } from "./components/users/user-form.component";
import { ListComponent } from './../application-shared/components/list/list.component'
import { RoleFormComponent } from './components/roles/role-form.component';
import { HerbCategoryDetailComponent } from './components/configurations/herb-category/herb-category-detail.component';
import { HerbCategoryComponent } from './components/configurations/herb-category/herb-category-form.component';
import { FormulaCategoryDetailComponent } from './components/configurations/formula-category/formula-category-detail.component';
import { FormulaCategoryComponent } from './components/configurations/formula-category/formula-category-form.component';
import { HerbSubCategoryComponent } from './components/configurations/herb-category/herb-sub-category-form.component';
import { FormulaSubCategoryComponent } from './components/configurations/formula-category/formula-sub-category-form.component';
import { ClassicalFormulaFormComponent } from './components/configurations/classical-formula/classical-formula-form.component';
import { ChangePasswordComponent } from './components/users/change-password.component';

import { LoanTypeComponent } from './components/configurations/loan-type/loantype-form.component';
import { ChecklistTypeComponent } from './components/configurations/checklist-type/checklisttype-form.component';
import { ApproverGroupComponent } from './components/configurations/approver-group/approver-group.form.component';
import { ApprovalProcessComponent } from './components/configurations/approval-process/approval-process.form.component';

const routes: Routes = [{
    path: '', component: SystemSettingsComponent,
  children: [
      { path: 'configurations', component: ConfigurationComponent, data: { title: 'System Settings' } },
     
      { path: 'business-profiles', component: ListComponent, data: { title: 'Business Profile' } },
      { path: 'business-profile', component: BusinessProfileDetailsComponent, data: { title: 'New Business Profile' } },
      { path: 'business-profile/:businessProfileId', component: BusinessProfileDetailsComponent, data: { title: 'Modify Business Profile' } },

      { path: 'types-and-categories', component: TypeAndCategoryComponent, data: { title: 'Type & Category' } },
      { path: 'type-and-category/:routingKey', component: CustomCategoriesComponent, data: { title: 'Type & Category' } },
      { path: 'type-and-category/:routingKey/new', component: CustomCategoryFormComponent, data: { title: 'Type & Category' } },
      { path: 'type-and-category/:routingKey/:id', component: CustomCategoryFormComponent, data: { title: 'Type & Category' } },

      { path: 'users', component: ListComponent, data: { title: 'Users' } },
      { path: 'user', component: UserFormComponent, data: { title: 'User Detail' } },
      { path: 'user/:userid', component: UserFormComponent, data: { title: 'User Detail' } },

      { path: 'roles', component: ListComponent, data: { title: 'Roles' } },
      { path: 'role', component: RoleFormComponent, data: { title: 'Role Detail' } },
      { path: 'role/:roleId', component: RoleFormComponent, data: { title: 'Role Detail' } },


      { path: 'configuration/loan-types', component: ListComponent, data: { title: 'Loan Type' } },
      { path: 'configuration/loan-type', component: LoanTypeComponent, data: { title: 'New Loan Type' } },
      { path: 'configuration/loan-type/:loanTypeId', component: LoanTypeComponent, data: { title: 'Loan Type Detail' } },

      { path: 'configuration/checklist-types', component: ListComponent, data: { title: 'Document Checklist' } },
      { path: 'configuration/checklist-type', component: ChecklistTypeComponent, data: { title: 'New Document Checklist' } },
      { path: 'configuration/checklist-type/:checklistTypeId', component: ChecklistTypeComponent, data: { title: 'Document Checklist Detail' } },


      { path: 'configuration/approver-groups', component: ListComponent, data: { title: 'Approver Group' } },
      { path: 'configuration/approver-group', component: ApproverGroupComponent, data: { title: 'New Approver Group' } },
      { path: 'configuration/approver-group/:Id', component: ApproverGroupComponent, data: { title: 'Approver Group Detail' } },


      { path: 'configuration/approval-processes', component: ListComponent, data: { title: 'Approval Process' } },
      { path: 'configuration/approval-process', component: ApprovalProcessComponent, data: { title: 'New Approval Process' } },
      { path: 'configuration/approval-process/:Id', component: ApprovalProcessComponent, data: { title: 'Approval Process Detail' } },


    ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemSettingsRoutingModule
{
}

export const RoutedComponents = [
    BusinessProfilesComponent
    , BusinessProfileDetailsComponent
    , BusinessProfileGeneralInformationComponent
    , SystemSettingsComponent
    , ConfigurationComponent
    , SecurityConfigurationComponent
    , DocumentExtensionsComponent
    , DocumentExtensionFormComponent
    , EmailServersComponent
    , EmailServerFormComponent    
    , SecurityProfilesFormComponent
    , SecurityPolicyComponent
    , PasswordSettingComponent
    , SessionAccessControlComponent
    , SystemConfigurationComponent
    , TypeAndCategoryComponent
    , CustomCategoriesComponent
    , CustomCategoryFormComponent
    , UserFormComponent
    , RoleFormComponent
    , HerbCategoryComponent
    , HerbCategoryDetailComponent
    , FormulaCategoryComponent
    , FormulaCategoryDetailComponent
    , HerbSubCategoryComponent
    , FormulaSubCategoryComponent
    , ClassicalFormulaFormComponent
    , ChangePasswordComponent
    , LoanTypeComponent
    , ApproverGroupComponent
    , ApprovalProcessComponent
    , ChecklistTypeComponent
];


import { NgModule } from '@angular/core';
import { DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule, DxToolbarModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxTabPanelModule, DxTagBoxModule, DxRadioGroupModule, DxDropDownBoxModule  } from 'devextreme-angular';
import { CrmRoutingModule, RoutedComponents } from './crm-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationSharedModule } from './../application-shared/application-shared.module';
import { ContactDetailComponent } from './components/contact/contact-detail.component'
import { ContactsComponent } from './components/contact/contacts.component'
import { CompanyService } from './services/company.service'
import { ContactService } from './services/contact.service';
import { PatientService } from './services/patient.service';
import { PractitionerService } from './services/practitioner.service';
import { ClinicService } from './services/clinic.service';
import { SupplierService } from './services/supplier.service';
import { BranchService } from './services/branch.service';
import { NpDatepickerModule } from 'angular-nepali-datepicker';

@NgModule({
    imports: [CrmRoutingModule
        , DxDataGridModule
        , DxSelectBoxModule
        , DxCheckBoxModule
        , DxButtonModule
        , FormsModule
        , CommonModule
        , TranslateModule
        , ReactiveFormsModule
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
        , DxTabPanelModule
        , DxTagBoxModule
        , DxRadioGroupModule
        , DxDropDownBoxModule
        , NpDatepickerModule
    ],
    exports: [
        ContactDetailComponent, ContactsComponent
    ],
    declarations: [
        ...RoutedComponents
    ],
    providers: [
        CompanyService,
        ContactService,
        PatientService,
        PractitionerService,
        ClinicService,
        SupplierService,
        BranchService
    ]
})
export class CrmModule
{
}

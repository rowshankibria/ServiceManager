import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompaniesComponent } from './components/company/companies.component'
import { CompanyFormComponent } from './components/company/company-form.component'
import { CrmComponent } from './crm.component'
import { ContactDetailComponent } from './components/contact/contact-detail.component'
import { ContactFormComponent } from './components/contact/contact-form.component'
import { ContactsComponent } from './components/contact/contacts.component'
import { ListComponent } from './../application-shared/components/list/list.component'

import { PatientFormComponent } from './components/patient/patient-form.component'
import { PractitionerFormComponent } from './components/practitioner/practitioner-form.component'
import { PatientDetailComponent } from './components/patient/patient-detail.component'
import { PractitionerDetailComponent } from './components/practitioner/practitioner-detail.component'
import { CompanyDetailComponent } from './components/company/company-detail.component';
import { ClinicDetailComponent } from './components/clinic/clinic-detail.component';
import { ClinicFormComponent } from './components/clinic/clinic-form.component';
import { SupplierDetailComponent } from './components/supplier/supplier-detail.component';
import { SupplierFormComponent } from './components/supplier/supplier-form.component';
import { BranchComponent } from './components/branch/brnach-form.component';

const routes: Routes = [{
    path: '', component: CrmComponent,
    children: [
        { path: 'regions', component: ListComponent, data: { title: 'Regions' } },
        { path: 'region', component: CompanyFormComponent, data: { title: 'New Region' } },
        { path: 'region/:companyId', component: CompanyFormComponent, data: { title: 'Region Detail' } },

        { path: 'client', component: ContactDetailComponent, data: { title: 'Client Detail' } },
        { path: 'client/:clientId', component: ContactDetailComponent, data: { title: 'Client Detail' } },
        { path: 'clients', component: ListComponent, data: { title: 'Clients' } },

        { path: 'patients', component: ListComponent, data: { title: 'Patients' } },
        { path: 'patient', component: PatientDetailComponent, data: { title: 'New Patient' } },
        { path: 'patient/:contactId', component: PatientDetailComponent, data: { title: 'Patient Detail' } },

        { path: 'practitioners', component: ListComponent, data: { title: 'Practitioners' } },
        { path: 'practitioner', component: PractitionerDetailComponent, data: { title: 'New Practitioner' } },
        { path: 'practitioner/:contactId', component: PractitionerDetailComponent, data: { title: 'Practitioner Detail' } },
                        
        { path: 'practitioner-patient/:practitionerId', component: PatientDetailComponent, data: { title: 'New Practitioner' } },
        { path: 'practitioner-patient/:practitionerId/:contactId', component: PatientDetailComponent, data: { title: 'Practitioner Detail' } },

        { path: 'clinics', component: ListComponent, data: { title: 'Clinics' } },
        { path: 'clinic', component: ClinicDetailComponent, data: { title: 'New Clinic' } },
        { path: 'clinic/:companyId', component: ClinicDetailComponent, data: { title: 'Clinic Detail' } },

        { path: 'suppliers', component: ListComponent, data: { title: 'Suppliers' } },
        { path: 'supplier', component: SupplierDetailComponent, data: { title: 'New Supplier' } },
        { path: 'supplier/:companyId', component: SupplierDetailComponent, data: { title: 'Supplier Detail' } },

        { path: 'branches', component: ListComponent, data: { title: 'Branches' } },
        { path: 'branch', component: BranchComponent, data: { title: 'New Branch' } },
        { path: 'branch/:branchId', component: BranchComponent, data: { title: 'Branch Detail' } },
    ],
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CrmRoutingModule {
}

export const RoutedComponents = [
    CrmComponent
    , CompaniesComponent
    , CompanyFormComponent
    , ContactDetailComponent
    , ContactsComponent
    , ContactFormComponent
    , PractitionerDetailComponent
    , PractitionerFormComponent
    , PatientDetailComponent
    , PatientFormComponent
    , CompanyDetailComponent
    , ClinicFormComponent
    , ClinicDetailComponent
    , SupplierFormComponent
    , SupplierDetailComponent
    , BranchComponent
];


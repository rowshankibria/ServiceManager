import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { CompanyFormComponent } from './components/company/company-form.component'
import { HrmComponent } from './hrm.component'
//import { ContactDetailComponent } from './components/contact/contact-detail.component'
//import { ContactFormComponent } from './components/contact/contact-form.component'
import { ListComponent } from './../application-shared/components/list/list.component';
import { EmployeeDetailComponent } from './componets/Employee/employee-detail.component';
import { EmployeeFormComponent } from './componets/Employee/employee-form.component';

const routes: Routes = [{
    path: '', component: HrmComponent,
    children: [
        { path: 'employees', component: ListComponent, data: { title: 'Employess' } },
        { path: 'employee', component: EmployeeDetailComponent, data: { title: 'New Employee' } },
        { path: 'employee/:employeeId', component: EmployeeDetailComponent, data: { title: 'Modify Employee' } },
       
    ],
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HrmRoutingModule {
}

export const RoutedComponents = [
    HrmComponent
    , EmployeeFormComponent
    , EmployeeDetailComponent
    
];


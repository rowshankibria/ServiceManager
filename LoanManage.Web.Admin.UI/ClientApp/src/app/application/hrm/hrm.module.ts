import { NgModule } from '@angular/core';
import { DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule, DxToolbarModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxTabPanelModule, DxTagBoxModule, DxRadioGroupModule, DxDropDownBoxModule  } from 'devextreme-angular';
import { HrmRoutingModule, RoutedComponents } from './hrm-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationSharedModule } from './../application-shared/application-shared.module';
import { CompanyService } from './../crm/services/company.service';
import { EmployeeService } from './services/employee.service';
import { EmployeeDetailComponent } from './componets/Employee/employee-detail.component';
import { SystemServiceModule } from './../system-service/system-service.module'
@NgModule({
    imports: [HrmRoutingModule
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
        , SystemServiceModule
    ],
    exports: [        
        EmployeeDetailComponent
    ],
    declarations: [
        ...RoutedComponents
    ],
    providers: [
        EmployeeService,
        CompanyService
    ]
})
export class HrmModule
{
}

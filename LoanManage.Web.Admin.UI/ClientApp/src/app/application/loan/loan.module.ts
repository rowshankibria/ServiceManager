import { NgModule } from '@angular/core';
import { LoanRoutingModule, RoutedComponents } from './loan-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
    DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxToolbarModule,
    DxDataGridModule, DxSelectBoxModule, DxButtonModule, DxTextBoxModule, DxValidatorModule,
    DxValidationGroupModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule,
    DxColorBoxModule, DxMultiViewModule, DxRadioGroupModule, DxTreeListModule, DxFileUploaderModule,
    DxTagBoxModule, DxDropDownBoxModule
} from 'devextreme-angular';

//import application modules
import { ApplicationSharedModule } from './../application-shared/application-shared.module';
import { SystemServiceModule } from './../system-service/system-service.module';
import { LoanApplicationService } from './services/loan-application.service';
import { NpDatepickerModule } from 'angular-nepali-datepicker';


@NgModule({
    imports: [LoanRoutingModule,
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
        , NpDatepickerModule
    ],
    exports: [
 
    ],
    declarations: [
        ...RoutedComponents
    ],
    providers: [
        LoanApplicationService
    ]
})
export class LoanModule {
}

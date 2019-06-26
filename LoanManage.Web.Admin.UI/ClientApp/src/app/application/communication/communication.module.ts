import { NgModule } from '@angular/core';
import { DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule, DxToolbarModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxTabPanelModule, DxTagBoxModule, DxRadioGroupModule, DxDropDownBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule } from 'devextreme-angular';
import { CommunicationRoutingModule, RoutedComponents } from './communication-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationSharedModule } from './../application-shared/application-shared.module';
import { CommunicationService } from './services/communication.service'
import { CommunicationComponent } from './communication.component';
import { DmsModule } from '../dms/dms.module';

@NgModule({
    imports: [CommunicationRoutingModule
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
        , DmsModule
    ],
    exports: [
        CommunicationComponent
    ],
    declarations: [
        ...RoutedComponents
    ],
    providers: [
        CommunicationService
    ]})
export class CommunicationModule {
}

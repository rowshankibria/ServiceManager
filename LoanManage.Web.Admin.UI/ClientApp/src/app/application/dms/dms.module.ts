import { NgModule } from '@angular/core';
import { DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule, DxToolbarModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxTabPanelModule, DxTagBoxModule, DxRadioGroupModule, DxFileUploaderModule  } from 'devextreme-angular';
import { DmsRoutingModule, RoutedComponents } from './dms-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule } from 'devextreme-angular';
import { ApplicationSharedModule } from './../application-shared/application-shared.module';
import { FileUploadComponent } from './componets/file-upload.component';
import { DmsService } from './services/dms.service';
 

@NgModule({
    imports: [DmsRoutingModule
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
        , DxFileUploaderModule
         
    ],
    exports: [
        FileUploadComponent
    ],
    declarations: [
        ...RoutedComponents
    ],
    providers: [
        DmsService
    ]
})
export class DmsModule
{
}

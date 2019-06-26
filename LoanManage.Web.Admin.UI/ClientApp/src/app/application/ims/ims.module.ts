import { NgModule } from '@angular/core';
import { DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule, DxToolbarModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxTabPanelModule, DxTagBoxModule, DxRadioGroupModule, DxDropDownBoxModule } from 'devextreme-angular';
import { ImsRoutingModule, RoutedComponents } from './ims-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { ApplicationSharedModule } from './../application-shared/application-shared.module';
import { ProductService } from './services/product.service';

@NgModule({
    imports: [ImsRoutingModule
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
        , AngularDualListBoxModule
    ],
    exports: [        
    ],
    declarations: [
        ...RoutedComponents
    ],
    providers: [
        ProductService
    ]
})
export class ImsModule {
}

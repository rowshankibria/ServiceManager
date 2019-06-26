import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule, DxToolbarModule, DxTextBoxModule, DxValidatorModule, DxFileUploaderModule, DxDropDownBoxModule, DxValidationGroupModule, DxAutocompleteModule } from 'devextreme-angular';

import { ApplicationSharedModule } from './../application-shared/application-shared.module';
import { AddressComponent } from './components/address/address-form.component';
import { InlineAddressComponent } from './components/address/inline-address.component';
import { AddressService } from './services/address.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule
        , FormsModule
        , DxToolbarModule
        , DxDataGridModule
        , DxCheckBoxModule
        , RouterModule
        , TranslateModule
        , NgbModule
        , DxFileUploaderModule
        , DxDropDownBoxModule
        , DxValidatorModule
        , DxValidationGroupModule
        , DxSelectBoxModule
        , DxTextBoxModule
        , DxAutocompleteModule
        , ApplicationSharedModule
        , DxButtonModule
    ],
    exports: [
        AddressComponent,
        InlineAddressComponent
    ],
    declarations: [
        AddressComponent,
        InlineAddressComponent
    ],
    providers: [
        AddressService
    ]
})
export class SystemServiceModule
{
}

import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitlebarComponent } from './components/titlebar/titlebar.component'
import { SidebarComponent } from './components/sidebar/sidebar.component'
import { HeaderComponent } from './components/header/header.component'
import { ImageUploadComponent } from './components/common/image-upload.component';
import { DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule, DxToolbarModule, DxTextBoxModule, DxValidatorModule, DxFileUploaderModule, DxDropDownBoxModule, DxValidationGroupModule } from 'devextreme-angular';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { ListService } from './services/list.service'
import { EntitySelectBoxService } from './services/entity-select-box.service'
import { ApplicationMenuService } from './services/application-menu.service'
import { ListComponent } from './components/list/list.component'
import { EntitySelectBoxComponent } from './components/common/app-entity-select-box.component'
import { TemplateDetailFormComponent } from './template/detail-page/template-detail-form.component';
import { FormsModule } from '@angular/forms';

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
    ],
    declarations: [
        TitlebarComponent
        , SidebarComponent
        , HeaderComponent
        , ListComponent
        , EntitySelectBoxComponent
        , ImageUploadComponent
        , TemplateDetailFormComponent
    ],
    exports: [
        TitlebarComponent
        , SidebarComponent
        , HeaderComponent
        , ListComponent
        , EntitySelectBoxComponent
        , ImageUploadComponent
        , TemplateDetailFormComponent
    ],
    providers: [
        ListService,
        EntitySelectBoxService,
        ApplicationMenuService
    ]
})
export class ApplicationSharedModule
{

}

import { NgModule } from '@angular/core';
import { ApplicationComponent } from './application.component';
import { ApplicationRoutingModule } from './application-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component'
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule,
    DxToolbarModule, DxTextBoxModule, DxValidationGroupModule, DxValidationGroupComponent,
    DxMultiViewModule, DxRadioGroupModule, DxPieChartModule
} from 'devextreme-angular';
import { ApplicationSharedModule } from './../application/application-shared/application-shared.module';
import { LoanApplicationService } from './loan/services/loan-application.service';

@NgModule({
    imports: [CommonModule
        , ApplicationRoutingModule
        , TranslateModule
        , NgbModule.forRoot()
        , ReactiveFormsModule
        , FormsModule
        , DxToolbarModule
        , ApplicationSharedModule
        , DxDataGridModule
        , DxValidationGroupModule
        , DxMultiViewModule        
        , DxRadioGroupModule
        , DxPieChartModule
    ],
    declarations: [ApplicationComponent
        , DashboardComponent
       
    ],
    providers: [
        LoanApplicationService
    ],
    exports: [

    ]
})
export class ApplicationModule
{
    constructor(private translate: TranslateService)
    {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de/) ? browserLang : 'en');
    }
}

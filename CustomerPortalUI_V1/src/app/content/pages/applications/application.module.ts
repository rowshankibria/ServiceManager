import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../../layout/layout.module';
import { ApplicationDetailsComponent } from './application-edit/application-details.component';
import { ApplicationsListComponent } from './applications-list/applications-list.component';
import { PartialsModule } from '../../partials/partials.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightModule } from 'ngx-highlightjs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule
} from '@angular/material';
import { environment } from '../../../../environments/environment';
import { ApplicationComponent } from './application.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpUtilsService } from '../../../core/services/http-utils.service';
import { LayoutUtilsService } from '../../../core/services/layout-utils.service';
import { TypesUtilsService } from '../../../core/services/types-utils.service';
import { ApplicationService } from '../../../core/services/applications.service';
import { InterceptService } from '../../../core/services/intercept.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeApiService } from '../../../fake-api/fake-api.service';
import { BrowserModule } from '@angular/platform-browser';
import { DxDateBoxModule } from 'devextreme-angular';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, 
	DxToolbarModule, DxDataGridModule, DxSelectBoxModule, DxButtonModule, 
	DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxTextAreaModule, 
	DxFormModule, DxNumberBoxModule, DxColorBoxModule, DxMultiViewModule, DxRadioGroupModule
	, DxTreeListModule, DxFileUploaderModule, DxTagBoxModule, DxDropDownBoxModule } from 'devextreme-angular';


const routes: Routes = [
	{
		path: '',
		component: ApplicationComponent,
		children: [
			{
				path: '',
				redirectTo: 'applications',
				pathMatch: 'full'
			},
			{
				path: 'applications',
				component: ApplicationsListComponent
			},
			{
				path: 'applications/add',
				component: ApplicationDetailsComponent
			},
			{
				path: 'applications/edit',
				component: ApplicationDetailsComponent
			},
			{
				path: 'applications/edit/:id',
				component: ApplicationDetailsComponent
			},
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
        DxDateBoxModule,
		LayoutModule,
		PartialsModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,		
        PerfectScrollbarModule,
        MatDialogModule,
		CommonModule,
		PartialsModule,
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
        MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule,
		
		DxToolbarModule
        , DxTabPanelModule
        , DxCheckBoxModule
        , DxTemplateModule
        , DxDataGridModule
     
        , DxToolbarModule
        , DxSelectBoxModule
        , DxTextAreaModule
        , DxDateBoxModule
        , DxFormModule
        , DxNumberBoxModule
        , DxTextBoxModule
        , DxValidatorModule
       
        , DxValidationGroupModule
        , DxColorBoxModule        
        , DxMultiViewModule
        , DxRadioGroupModule
        , DxTreeListModule
        , DxFileUploaderModule
        , DxTagBoxModule
        , DxDropDownBoxModule
        , DxButtonModule,


		HighlightModule.forRoot({ theme: 'googlecode' }),
		RouterModule.forChild(routes),
		environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService) : []
	],
	providers: [
		InterceptService,
      	{
        	provide: HTTP_INTERCEPTORS,
       	 	useClass: InterceptService,
        	multi: true
      	},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'm-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		HttpUtilsService,
		//ApplicationService,
		TypesUtilsService,
		LayoutUtilsService
	],
	declarations: [
		ApplicationComponent,
		ApplicationsListComponent,
		ApplicationDetailsComponent
	]
})
export class ApplicationModule {}

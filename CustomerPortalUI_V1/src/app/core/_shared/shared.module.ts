import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActionNotificationComponent } from './action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from './delete-entity-dialog/delete-entity-dialog.component';
import { FetchEntityDialogComponent } from './fetch-entity-dialog/fetch-entity-dialog.component';
import { UpdateStatusDialogComponent } from './update-status-dialog/update-status-dialog.component';
import { AlertComponent } from './alert/alert.component';
import { PagesRoutingModule } from '../../content/pages/pages-routing.module';
import { LayoutModule } from '@angular/cdk/layout';
import { PartialsModule } from '../../content/partials/partials.module';
import { MatProgressSpinnerModule, MatIconModule } from '@angular/material';

@NgModule({
	declarations: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent,
	],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		PagesRoutingModule,
		CoreModule,
		LayoutModule,
		PartialsModule,
        AngularEditorModule,
        MatProgressSpinnerModule,
        MatIconModule,
	],
	providers: []
})
export class SharedModule {
}

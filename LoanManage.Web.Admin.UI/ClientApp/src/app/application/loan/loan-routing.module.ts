import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './../application-shared/components/list/list.component';
import { LoanComponent } from "./loan.component";
import { ApplicationDetailsComponent } from "./components/application-form.component";
import { LoanApplicationDetailComponent } from "./components/loan-application-detail.component";
import { ChecklistComponent } from "./components/checklist.component";
import { NoteComponent } from "./components/note.component";
import { FileUploaderComponent } from "./components/fileuploader.component";
import { FileUploaderFormComponent } from "./components/fileuploader-form.component";
import { NoteSystemComponent } from './components/note-system.component';
import { NoteQAComponent } from './components/note-qa.component';


const routes: Routes = [{
    path: '', component: LoanComponent,
    children: [

        { path: 'applications', component: ListComponent, data: { title: 'Applications' } },
        { path: 'submitApplications', component: ListComponent, data: { title: 'Submit Applications' } },
        { path: 'application', component: LoanApplicationDetailComponent, data: { title: 'New Application' } },
        { path: 'application/:applicationId', component: LoanApplicationDetailComponent, data: { title: 'Application Detail' } },
    ],
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoanRoutingModule {
}

export const RoutedComponents = [
    LoanComponent
    , ApplicationDetailsComponent
    , LoanApplicationDetailComponent
    , ChecklistComponent
    , NoteComponent
    , NoteSystemComponent
    , NoteQAComponent
    , FileUploaderComponent
    , FileUploaderFormComponent
];


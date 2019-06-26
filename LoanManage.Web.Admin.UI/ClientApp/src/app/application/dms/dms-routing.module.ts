import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DmsComponent } from './dms.component'
import { ListComponent } from './../application-shared/components/list/list.component'
import { FileUploadComponent } from './componets/file-upload.component'
import { UploadDocumentsComponent } from './componets/upload-documents.component'
import { DocumentsComponent } from './componets/documents.component'
import { FileDownloadComponent } from './componets/file-download.component';

const routes: Routes = [{
    path: '', component: DmsComponent,
    children: [        
        { path: 'documents', component: DocumentsComponent, data: { title: 'documents' } },
        { path: 'document/upload', component: UploadDocumentsComponent, data: { title: 'upload documents' } },
        { path: 'document/upload/:documentId', component: UploadDocumentsComponent, data: { title: 'upload documents' } },
        { path: 'document/download/:documentKey', component: FileDownloadComponent, data: { title: 'Download File' } }
    ],
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DmsRoutingModule {
}

export const RoutedComponents = [
    DmsComponent,
    FileUploadComponent,
    UploadDocumentsComponent,
    DocumentsComponent,
    FileDownloadComponent
];


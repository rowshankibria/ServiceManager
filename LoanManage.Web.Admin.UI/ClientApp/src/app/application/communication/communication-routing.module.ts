import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunicationFormComponent } from './components/communication/communication-form.component';
import { CommunicationComponent } from './communication.component';
import { ListComponent } from './../application-shared/components/list/list.component'

const routes: Routes = [{
    path: '', component: CommunicationComponent,
    children: [
        { path: 'communications', component: ListComponent, data: { title: 'Communications' } },
        { path: 'communication', component: CommunicationFormComponent, data: { title: 'New Communication' } },
        { path: 'communication/:communicationId', component: CommunicationFormComponent, data: { title: 'Modify Communication' } },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]})
export class CommunicationRoutingModule
{

}

export const RoutedComponents = [
    CommunicationComponent
    , CommunicationFormComponent
];

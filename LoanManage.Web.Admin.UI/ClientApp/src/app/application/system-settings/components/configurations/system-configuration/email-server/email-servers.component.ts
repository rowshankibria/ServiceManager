import { Component, ViewChild, HostListener } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { Observable } from 'rxjs';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';
import { EmailServerService } from './../../../../services/email-server.service';
import { ShowYesNoDirective } from './../../../../../../shared/directives/show-yes-no.directive';
@Component({
    selector: 'app-email-servers',
    templateUrl: './email-servers.component.html',
    styleUrls: ['./email-servers.component.scss']
})
export class EmailServersComponent {
    gridHeight: number = 500;
    dataSource: any = [];
    selectedRows: string[];

    @ViewChild('grdEmailServers')
    grdCompany: DxDataGridComponent;

    constructor(private emailServerService: EmailServerService)
    {
        //this.dataSource = new DataSource({
        //    load: function (loadOptions: any)
        //    {
        //        return emailServerService.getDXGridEmailServer(loadOptions).then(response =>
        //        {
        //            return {
        //                data: response.result.data,
        //                totalCount: response.result.totalCount
        //            }
        //        });
        //    }
        //});
    }
}

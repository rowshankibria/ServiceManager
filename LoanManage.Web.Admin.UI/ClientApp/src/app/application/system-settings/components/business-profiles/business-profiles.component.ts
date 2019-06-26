import { Component, ViewChild, HostListener } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { Observable } from 'rxjs';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';
import { BusinessProfileService } from './../../../system-settings/services/business-profile.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-business-profiles',
    templateUrl: './business-profiles.component.html',
    styleUrls: ['./business-profiles.component.scss']
})

export class BusinessProfilesComponent {
    gridHeight: number = 500;
    dataSource: any = [];
    selectedRows: string[];

    @ViewChild('grdBusinessProfiles')
    grdCompany: DxDataGridComponent;

    @HostListener('window:resize') onResize()
    {
        this.gridHeight = window.innerHeight - 110;
    }

    constructor(private businessProfileService: BusinessProfileService,
        private route: ActivatedRoute,
        private router: Router)
    {
        //debugger;
        this.dataSource = new DataSource({
            load: function (loadOptions: any)
            {
                return businessProfileService.getDXGridBusinessProfiles(loadOptions).then(response =>
                {
                    return {
                        data: response.result.data,
                        totalCount: response.result.totalCount
                    };
                });
            }
        });
    }

    updateRecords(data: any)
    {
        this.router.navigate(['system-settings/modify-business-profile/' + data.key.id]);
    }
}

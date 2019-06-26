import { Component, AfterViewInit } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxTabPanelComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicService } from '../../services/clinic.service';
import { EntityModel } from '../../../system-service/models/entityModel';


@Component({
    selector: 'app-clinic-detail',
    templateUrl: './clinic-detail.component.html',
    styleUrls: ['./clinic-detail.component.scss']
})

export class ClinicDetailComponent implements AfterViewInit{

    tabs: any = [];
    entityModel: EntityModel = new EntityModel();
    companyId: number = 0;
    tabPageServiceStyle: string = 'tab-item-invisible';

    constructor(private route: ActivatedRoute, private router: Router, private clinicService: ClinicService)
    {

        this.route.params.subscribe(params =>
        {
            if (params['companyId'] != undefined) {
                this.companyId = params['companyId'];
            }

        });

        this.entityModel.entityId = this.companyId;
        this.entityModel.entityType = 102;
        this.initTabs();
    }

    /**
     * initialize tab
     * */
    initTabs(): void
    {
        this.clinicService.getPageDetails(this.companyId).subscribe(data =>
        {
            this.tabs = data.result.tabItems
        });
    }

    /**
     * Event
     * */
    ngAfterViewInit(): void
    {

        //if it is new mode then hide other tab except primary component
        if (this.companyId != null && this.companyId != undefined) {
            this.tabPageServiceStyle = "tab-item-visible";
        }
    }
}

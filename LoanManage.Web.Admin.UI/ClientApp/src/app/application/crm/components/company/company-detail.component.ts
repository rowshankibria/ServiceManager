import { Component, AfterViewInit } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxTabPanelComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { EntityModel } from '../../../system-service/models/entityModel';


@Component({
    selector: 'app-company-detail',
    templateUrl: './company-detail.component.html',
    styleUrls: ['./company-detail.component.scss']
})
/** company-detail component*/
export class CompanyDetailComponent implements AfterViewInit{

    tabs: any = [];
    entityModel: EntityModel = new EntityModel();
    companyId: number = 0;
    tabPageServiceStyle: string = 'tab-item-invisible';

    constructor(private route: ActivatedRoute, private router: Router, private companyService: CompanyService)
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
        this.companyService.getPageDetails(this.companyId).subscribe(data =>
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

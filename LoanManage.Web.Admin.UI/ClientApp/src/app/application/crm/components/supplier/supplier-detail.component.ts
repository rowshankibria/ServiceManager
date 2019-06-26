import { Component, AfterViewInit } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxTabPanelComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { EntityModel } from '../../../system-service/models/entityModel';


@Component({
    selector: 'app-supplier-detail',
    templateUrl: './supplier-detail.component.html',
    styleUrls: ['./supplier-detail.component.scss']
})

export class SupplierDetailComponent implements AfterViewInit{

    tabs: any = [];
    entityModel: EntityModel = new EntityModel();
    companyId: number = 0;
    tabPageServiceStyle: string = 'tab-item-invisible';

    constructor(private route: ActivatedRoute, private router: Router, private supplierService: SupplierService)
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
        this.supplierService.getPageDetails(this.companyId).subscribe(data =>
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

import { Component, AfterViewInit } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxTabPanelComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PractitionerService } from '../../services/practitioner.service';
import { EntityModel } from '../../../system-service/models/entityModel';

@Component({
    selector: '.app-practitioner-detail',
    templateUrl: './practitioner-detail.component.html',
    styleUrls: ['./practitioner-detail.component.scss'],
})

export class PractitionerDetailComponent implements AfterViewInit {
        
    tabs: any = [];
    entityModel: EntityModel = new EntityModel();
    contactId: number = 0;
    tabPageServiceStyle: string = 'tab-item-invisible';
    pagekeyComponent: string = "practitioner-patients";

    constructor(private route: ActivatedRoute, private router: Router, private practitionerService: PractitionerService) {
        
        this.route.params.subscribe(params => {
            if (params['contactId'] != undefined) {
                this.contactId = params['contactId'];
            }

        });

        this.entityModel.entityId = this.contactId;
        this.entityModel.entityType = 102;
        this.initTabs();
    }

    /**
     * initialize tab
     * */
    initTabs(): void {        
        this.practitionerService.getContactPageDetails(this.contactId).subscribe(data => {
            this.tabs = data.result.tabItems
        });
    }

    /**
     * Event
     * */
    ngAfterViewInit(): void {

        //if it is new mode then hide other tab except primary component
        if (this.contactId != null && this.contactId != undefined) {
            this.tabPageServiceStyle = "tab-item-visible";
        }
    }
}

import { Component, AfterViewInit } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxTabPanelComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { EntityModel } from '../../../system-service/models/entityModel';

@Component({
    selector: '.app-patient-detail',
    templateUrl: './patient-detail.component.html',
    styleUrls: ['./patient-detail.component.scss'],
})

export class PatientDetailComponent implements AfterViewInit {
        
    tabs: any = [];
    entityModel: EntityModel = new EntityModel();
    contactId: number = 0;
    tabPageServiceStyle: string = 'tab-item-invisible';

    constructor(private route: ActivatedRoute, private router: Router, private patientService: PatientService) {
        
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
        this.patientService.getContactPageDetails(this.contactId).subscribe(data => {
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

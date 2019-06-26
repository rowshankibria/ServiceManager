import { Component, AfterViewInit } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxTabPanelComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { EntityModel } from '../../../system-service/models/entityModel';

@Component({
    selector: '.app-contact-detail',
    templateUrl: './contact-detail.component.html',
    styleUrls: ['./contact-detail.component.scss'],
})

export class ContactDetailComponent implements AfterViewInit {
        
    tabs: any = [];
    entityModel: EntityModel = new EntityModel();
    contactId: number = 0;
    tabPageServiceStyle: string = 'tab-item-invisible';
    nepaliDateOfBirth: any;

    constructor(private route: ActivatedRoute, private router: Router, private contactService: ContactService) {
        
        this.route.params.subscribe(params => {
            if (params['clientId'] != undefined) {
                this.contactId = params['clientId'];
            }

        });

        this.entityModel.entityId = this.contactId;
        this.entityModel.entityType = 102;
        //this.initTabs();
    }

    /**
     * initialize tab
     * */
    initTabs(): void {        
        this.contactService.getContactPageDetails(this.contactId).subscribe(data => {
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

import { Component, AfterViewInit } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxTabPanelComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityModel } from '../../system-service/models/entityModel';
import { LoanApplicationService } from '../services/loan-application.service';

@Component({
    selector: '.app-loan-application-detail',
    templateUrl: './loan-application-detail.component.html',
    styleUrls: ['./loan-application-detail.component.scss'],
})

export class LoanApplicationDetailComponent implements AfterViewInit {
        
    tabs: any = [];
    entityModel: EntityModel = new EntityModel();
    loanApplicationId: number = 0;
    tabPageServiceStyle: string = 'tab-item-invisible';
    pagekeyComponent: string = "documents";

    constructor(private route: ActivatedRoute, private router: Router, private loanService: LoanApplicationService) {        
        this.route.params.subscribe(params => {
            if (params['applicationId'] != undefined) {
                this.loanApplicationId = params['applicationId'];
            }

        });

        this.entityModel.entityId = this.loanApplicationId;
        this.entityModel.entityType = 501;
        this.initTabs();
    }

    /**
     * initialize tab
     * */
    initTabs(): void {        
        this.loanService.getLoanApplicationPageDetails(this.loanApplicationId).subscribe(data => {
            this.tabs = data.result.tabItems
        });
    }

    /**
     * Event
     * */
    ngAfterViewInit(): void {

        //if it is new mode then hide other tab except primary component
        if (this.loanApplicationId != null && this.loanApplicationId != undefined) {
            this.tabPageServiceStyle = "tab-item-visible";
        }
    }
}

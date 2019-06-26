import { Component, AfterViewInit } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxTabPanelComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';


@Component({
    selector: '.app-employee-detail',
    templateUrl: './employee-detail.component.html',
    styleUrls: ['./employee-detail.component.scss'],
})

export class EmployeeDetailComponent implements AfterViewInit {
        
    tabs: any = [];
    //entityModel: EntityModel = new EntityModel();
    employeeId: number = 0;
    tabPageServiceStyle: string = 'tab-item-invisible';
    entityType: number = 102;

    constructor(private route: ActivatedRoute, private router: Router, private employeeService: EmployeeService) {
        
        this.route.params.subscribe(params => {
            if (params['employeeId'] != undefined) {
                this.employeeId = params['employeeId'];
            }

        });

        //this.entityModel.entityId = this.contactId;
        //this.entityModel.entityType = 102;
        this.initTabs();
    }

    /**
     * initialize tab
     * */
    initTabs(): void {

        if (this.employeeId > 0) {

            this.employeeService.getEmployeePageTabs(this.employeeId).subscribe(data => {
                this.tabs = data.result.tabItems
            });
        }
    }

    /**
     * Event
     * */
    ngAfterViewInit(): void {

        //if it is new mode then hide other tab except primary component
        if (this.employeeId != null && this.employeeId != undefined) {
            this.tabPageServiceStyle = "tab-item-visible";
        }
    }
}

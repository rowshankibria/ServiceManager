import { Component, AfterViewInit, ViewChild, OnInit, Input, AfterViewChecked } from '@angular/core';
import { alert } from 'devextreme/ui/dialog';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { LoanApplicationService } from '../loan/services/loan-application.service';
import { MessageService } from './../../shared/services/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../shared/services/navigation.service';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
/** dashboard component*/
export class DashboardComponent implements AfterViewChecked {

    applicationSummary: LoanApplicationSummary[] = [];
    branchSummary: LoanApplicationBranchSummary[] = [];
    applicationTotal: any = [];
    contentClass: any = "detail-page-content-div";


    populationByRegions: PopulationByRegion[] = [{
        region: "Not Started",
        val: 50.0
    }, {
        region: "In Progress",
        val: 70.0
    }, {
        region: "Accepted",
        val: 200.0
    }, {
        region: "Rejected",
        val: 20.0
    }];

    //applicationByBranch: PopulationByRegion[] = [{
    //    region: "Not Started",
    //    val: 50.0
    //}, {
    //    region: "In Progress",
    //    val: 70.0
    //}, {
    //    region: "Accepted",
    //    val: 200.0
    //}, {
    //    region: "Rejected",
    //    val: 20.0
    //}];

    /**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    constructor(private loanService: LoanApplicationService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

    }


    ngAfterViewChecked(): void {

    }

    ngOnInit(): void {

        //if(this.applicationId > 0)
        //    this.addToolbarAdditionalItems();
        this.init();
    }

    /**
    * Init method
    **/
    init(): void {

        this.loanService.getDashboardApplication().subscribe(data => {
            this.setApplicationSummary(data.result.applicationSummary);
            this.setApplicationBranchSummary(data.result.branchSummary),
                this.applicationTotal = data.result.applicationTotalModel;
        });

    }

    setApplicationSummary(model) {
        
        // iterate over each element in the array
        for (var i = 0; i < model.length; i++) {

            var obj = new LoanApplicationSummary();
            obj.loanStatus = model[i].loanStatus;
            obj.val = model[i].numberOfApplication;
            //add to the targetted array
            this.applicationSummary.push(obj);
        }
    }

    setApplicationBranchSummary(model) {
                
        // iterate over each element in the array
        for (var i = 0; i < model.length; i++) {

            var obj = new LoanApplicationBranchSummary();
            obj.branchName = model[i].branchName;
            obj.val = model[i].numberOfApplication;
            //add to the targetted array
            this.branchSummary.push(obj);
        }

    }

    customizeTooltip = (arg: any) => {

        return {
            text: arg.argumentText + " (Percentage: " + arg.percentText + ")"
        };
    }

}


export class LoanApplicationSummary {
    loanStatus: string;
    val: number;
}


export class LoanApplicationBranchSummary {
    branchName: string;
    val: number;
}


export class PopulationByRegion {
    region: string;
    val: number;
}

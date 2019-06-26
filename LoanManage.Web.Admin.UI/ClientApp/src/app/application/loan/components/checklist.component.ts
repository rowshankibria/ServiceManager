import { Component, AfterViewInit, ViewChild, OnInit, Input, AfterViewChecked } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { LoanApplicationService } from '../services/loan-application.service';
import { MessageService } from './../../../shared/services/message.service';
import { TitlebarComponent } from './../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../application-shared/components/titlebar/utilities';
import { NavigationService } from '../../../shared/services/navigation.service';
import CustomStore from "devextreme/data/custom_store";
import { DxNumberBoxComponent, DxTextBoxComponent, DxTextAreaComponent, DxSelectBoxComponent, DxDataGridComponent, DxButtonComponent, DxRadioGroupComponent, DxTextAreaModule } from 'devextreme-angular';
import { EntityModel } from '../../system-service/models/entityModel';
import { ToolbarItem, ToolbarItemOption } from '../../application-shared/components/titlebar/toolbar-item';
import { ApprovalStatusMapType, LoanStatusMapType, ApproverGroupTypeMapType } from '../../application-shared/components/titlebar/utilities';
declare var $: any;

@Component({
    selector: 'app-checklist',
    templateUrl: './checklist.component.html',
    styleUrls: ['./checklist.component.scss'],
})

export class ChecklistComponent implements AfterViewChecked {


    applicationChecklist: any = [];
    loanApplicationModel: any = [];
    approverGroupList: any = [];
    applicationId: any = 0;
    loanStatusMapTypeId: any = 0;
    approvalStatusId: any = 0;
    approverGroupTypeId: any = 0;
    currentApproverGroupTypeId: any = 0;
    disableItem: boolean = false;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    entityTitle: string = "Checklist";
    toolbarType: ToolbarType = ToolbarType.DetailPage;


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

        this.route.params.subscribe(params => {
            if (params['applicationId'] !== undefined) {
                this.applicationId = params['applicationId'];
                this.toolbarType = ToolbarType.DetailPage;
            }
        });


    }

    ngOnInit(): void {

        //if(this.applicationId > 0)
        //    this.addToolbarAdditionalItems();
        this.init();
    }

    ngAfterViewInit(): void {


    }



    ngAfterViewChecked(): void {
        // ...

    }

    /************************************************ Method Start *********************************** */


    /**
     * Init method
     **/
    init(): void {

        this.loanService.getApplicationChecklist(this.applicationId).subscribe(data => {

            this.applicationChecklist = data.result.applicationChecklist,
                this.loanApplicationModel = data.result.loanApplicationModel,
                this.approverGroupList = data.result.approverGroupList,
                this.setApprovalConfiguration(data.result.loanApplicationModel),
                this.titlebar.initializeToolbar("Checklist", null, this.toolbarType, this.disableItem);
        });

    }

    setApprovalConfiguration(model) {

        if (this.applicationId > 0) {

            this.loanStatusMapTypeId = model.loanStatusMapTypeId;
            this.approvalStatusId = model.approvalStatusId;
            this.approverGroupTypeId = model.approverGroupTypeId;
            this.currentApproverGroupTypeId = model.currentApproverGroupTypeId;

            //if the loan is not started
            if (this.loanStatusMapTypeId == LoanStatusMapType.NotStarted) {
                this.disableItem = false;
            }
            else if (this.loanStatusMapTypeId == LoanStatusMapType.InProgress) {
                this.disableItem = false;
            }
            else if (this.loanStatusMapTypeId == LoanStatusMapType.Approved) {
                this.disableItem = true;
            }
            else if (this.loanStatusMapTypeId == LoanStatusMapType.Rejected) {
                this.disableItem = true;
            }

            if (this.currentApproverGroupTypeId != this.approverGroupTypeId) {
                this.disableItem = true;
            }

        }
    }

    /*****************************  Credit Officer Start ******************************** */



    validateAndSave(action: DetailPageAction): void {

        this.saveEntity(action);
    }


    saveEntity(action: DetailPageAction): void {


        this.loanService.updateChecklist(this.applicationChecklist).subscribe(data => {
            this.messageService.success("Record has been saved successfully", 'Information');
            this.init();
        });

    }

    redirectToListPage(action: DetailPageAction): void {
        //debugger;
        var newNavigationUrl = '/loan/applications';


        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.applicationId, this.router.url);
        }
    }

    onSaveClicked(e): void {
        this.validateAndSave(DetailPageAction.Save);
    }

    onSaveNNewClicked(e): void {
        this.validateAndSave(DetailPageAction.SaveAndNew);
    }

    onSaveNCloseClicked(e): void {
        this.validateAndSave(DetailPageAction.SaveAndClose);
    }

    onCloseClicked(e): void {
        this.redirectToListPage(DetailPageAction.Close);
    }
}


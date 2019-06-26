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
import { environment } from '../../../../environments/environment';
import ValidationEngine from 'devextreme/ui/validation_engine';
declare var $: any;

@Component({
    selector: 'app-loan-application',
    templateUrl: './application-form.component.html',
    styleUrls: ['./application-form.component.scss'],
})

export class ApplicationDetailsComponent implements AfterViewChecked {

    private apiUrl: string = '';
    imageUrl: string = "../../../../../assets/img/no-image.png";
    disableItem: boolean = false;
    @Input() entityModel: EntityModel = new EntityModel();
    contactDataSource: any = [];
    applicationDataSource: any = [];
    toolbarAdditionalItems: ToolbarItem[];

    genderSelectItems: any = [];
    applicationStatusTypeSelectItems: any = [];
    branchSelectItems: any = [];
    loanTypeSelectItems: any = [];
    applicationCustomFields: any = [];
    temporaryDataSource: any = [];
    employeeSelectItems: any = [];
    currentAssigneeSelectItems: any = [];
    noteLogsCurrentAssignee: any = [];

    showGroup: any = "card mb-1 item-visible";
    hideGroup: any = "card mb-1 item-invisible";
    customFieldClassGroup: any = this.hideGroup;

    showInitialGroup: any = "row form-group item-visible";
    hideInitialGroup: any = "row form-group item-invisible";
    initialClassGroup: any = this.showInitialGroup;

    minDate: Date = new Date(1900, 0, 1);
    nowDate: Date = new Date();
    maxDate: Date = new Date(this.nowDate.getFullYear() - 18, this.nowDate.getMonth(), this.nowDate.getDate());
    contentClass: any = "detail-page-content-div";

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    applicationId: any = 0;

    entityTitle: string = "Application";
    loanTypeId: any = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;

    notStartedColor: any = "#FE7510";
    inProgressColor: any = "#AA17B0";
    acceptedColor: any = "#76b007";
    rejectedColor: any = "#FF0000";
    reviewColor: any = "#3F8BFA";
    approvalText: any = "Not Started";

    loanStatusMapTypeId: any = 0;
    approvalMappingId: any = 0;
    approvalStatusId: any = 0;
    approverGroupTypeId: any = 0;
    currentApproverGroupTypeId: any = 0;

    isCreditOperationNeeded: boolean = false;
    isRiskLegalNeeded: boolean = false;
    isSubmittedForCreditOperation: boolean = false;
    isSubmittedForRiskLegal: boolean = false;
    isClearedFromCreditOperation: boolean = false;
    isClearedFromRiskLegal: boolean = false;
    isSubmittedToCreditAdministrator: boolean = false;
    nepaliDate: any;

    @ViewChild("questionsTextArea")
    private questionsTextArea: DxTextAreaComponent;


    NotStarted: any = 18;
    InProgress: any = 19;
    Accepted: any = 21;
    Rejected: any = 22;

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
                this.contentClass = "detail-page-content-div";
            }
        });

        this.apiUrl = environment.rootUrl;
        this.toolbarAdditionalItems = [];
    }

    ngOnInit(): void {

        //if(this.applicationId > 0)
        //    this.addToolbarAdditionalItems();
        this.init();
    }

    ngAfterViewInit(): void {
        //this.formValidation.instance.validate();
        this.addTagToApprovalConfiguration();
    }

    addTagToApprovalConfiguration() {

        //if the loan is not started
        if (this.approvalStatusId == ApprovalStatusMapType.NotStarted) {
            this.approvalText = "Not Started";
            $(".ribbon span").css("background", "#FE7510");
        }
        else if (this.approvalStatusId == ApprovalStatusMapType.InProgress) {
            this.approvalText = "In Progress";
            $(".ribbon span").css("background", "#AA17B0");
        }
        else if (this.approvalStatusId == ApprovalStatusMapType.Review) {
            this.approvalText = "Review";
            $(".ribbon span").css("background", "#3F8BFA");
        }
        else if (this.approvalStatusId == ApprovalStatusMapType.Accepted) {
            this.approvalText = "Accepted";
            $(".ribbon span").css("background", "#76b007");
        }
        else if (this.approvalStatusId == ApprovalStatusMapType.Rejected) {
            this.approvalText = "Rejected";
            $(".ribbon span").css("background", "#FF0000");
        }
        else {
            this.approvalText = "Not Started";
            $(".ribbon span").css("background", "#FE7510");
        }

    }

    ngAfterViewChecked(): void {
        // ...

        if (this.applicationId > 0) {
            //this.customFieldClassGroup = this.showGroup;
            //this.initialClassGroup = this.hideInitialGroup;
            $("#editDiv").show();
            $("#initDiv").hide();
        }
        else {
            $("#editDiv").hide();
            $("#initDiv").show();
        }

    }

    /************************************************ Method Start *********************************** */


    /**
     * Init method
     **/
    init(): void {

        this.loanService.getApplication(this.applicationId).subscribe(data => {

            this.genderSelectItems = data.result.genderSelectItems,
                this.applicationStatusTypeSelectItems = data.result.applicationStatusTypeSelectItems,
                this.branchSelectItems = data.result.branchSelectItems,
                this.loanTypeSelectItems = data.result.loanTypeSelectItems,
                this.employeeSelectItems = data.result.employeeSelectItems,
                this.currentAssigneeSelectItems = data.result.currentAssigneeSelectItems,
                this.noteLogsCurrentAssignee = data.result.noteLogsCurrentAssignee,

                this.contactDataSource = data.result.loanApplicationModel.contact,
                this.applicationDataSource = data.result.loanApplicationModel,
                this.setApprovalConfiguration(data.result.loanApplicationModel),
                this.applicationCustomFields = data.result.loanApplicationModel.applicationCustomFields,
                this.setToolbarConfiguration(data.result.loanApplicationModel);
            //this.titlebar.initializeToolbar(this.applicationId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.result.loanApplicationModel.applicationId, this.applicationId == 0 ? null : this.toolbarAdditionalItems, this.toolbarType, this.disableItem);
        });

    }

    setToolbarConfiguration(data) {
        //debugger;
        if (data.loginUserId == data.currentAssignedEmployeeContactId) {

            //if it is in progress
            if (this.approvalStatusId > 0 && this.approvalStatusId == this.InProgress && this.approvalStatusId != this.NotStarted) {

                this.disableItem = false;
                this.titlebar.initializeToolbar(this.applicationId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.applicationId, this.applicationId == 0 ? null : this.toolbarAdditionalItems, this.toolbarType, false);
            }
            else {

                this.titlebar.initializeToolbar(this.applicationId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.applicationId, this.applicationId == 0 ? null : this.toolbarAdditionalItems, this.toolbarType, this.disableItem);
            }
        }
        else {

            if (this.approvalStatusId > 0 && this.approvalStatusId != this.Accepted && this.approvalStatusId != this.NotStarted) {

                //this.addAssigneeUpdateToolbarItems();
                this.titlebar.initializeToolbar(this.applicationId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.applicationId, this.applicationId == 0 ? null : this.toolbarAdditionalItems, this.toolbarType, this.disableItem);
            }
            else {
                this.titlebar.initializeToolbar(this.applicationId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.applicationId, this.applicationId == 0 ? null : this.toolbarAdditionalItems, this.toolbarType, this.disableItem);
            }
        }

    }

    //set approval configuration 
    setApprovalConfiguration(model) {

        if (this.applicationId > 0) {

            this.loanStatusMapTypeId = model.loanStatusMapTypeId;
            this.approvalMappingId = model.approvalMappingId;
            this.approvalStatusId = model.approvalStatusId;
            this.approverGroupTypeId = model.approverGroupTypeId;
            this.currentApproverGroupTypeId = model.currentApproverGroupTypeId;

            this.isCreditOperationNeeded = model.isCreditOperationNeeded;
            this.isRiskLegalNeeded = model.isRiskLegalNeeded;
            this.isSubmittedForCreditOperation = model.isSubmittedForCreditOperation;
            this.isSubmittedForRiskLegal = model.isSubmittedForRiskLegal;
            this.isClearedFromCreditOperation = model.isClearedFromCreditOperation;
            this.isClearedFromRiskLegal = model.isClearedFromRiskLegal;
            this.isSubmittedToCreditAdministrator = model.isSubmittedToCreditAdministrator;

            //if the loan is not started
            if (this.loanStatusMapTypeId == LoanStatusMapType.NotStarted) {
                this.disableItem = false;
                this.addToolbarAdditionalItems();
                this.addTagToApprovalConfiguration();

            }
            else if (this.loanStatusMapTypeId == LoanStatusMapType.InProgress) {

                this.disableItem = true;
                this.addTagToApprovalConfiguration();

                if (this.approverGroupTypeId == ApproverGroupTypeMapType.CreditOfficer) {

                    //do nothing                    
                }
                else if (this.approverGroupTypeId == ApproverGroupTypeMapType.BranchManager) {

                    if (this.currentApproverGroupTypeId == this.approverGroupTypeId) {

                        //accepted or rejected toolbar 
                        this.addAcceptedAndRejectedToolbarItems();
                    }

                }
                else if (this.approverGroupTypeId == ApproverGroupTypeMapType.ClusterHead) {

                    if (this.currentApproverGroupTypeId == this.approverGroupTypeId) {
                        //accepted or rejected toolbar 
                        this.addAcceptedAndRejectedToolbarItems();
                    }

                }
                else if (this.approverGroupTypeId == ApproverGroupTypeMapType.CreditOperation) {

                    if (this.currentApproverGroupTypeId == this.approverGroupTypeId) {
                        //accepted or rejected toolbar
                        this.addAcceptedAndRejectedToolbarItems();
                    }

                }
                else if (this.approverGroupTypeId == ApproverGroupTypeMapType.Risk_LegalAndCompliance) {

                    if (this.currentApproverGroupTypeId == this.approverGroupTypeId) {
                        //accepted or rejected toolbar
                        this.addAcceptedAndRejectedToolbarItems();
                    }

                }
                else if (this.approverGroupTypeId == ApproverGroupTypeMapType.DCEO_DGM) {

                    if (this.currentApproverGroupTypeId == this.approverGroupTypeId) {
                        //accepted or rejected toolbar
                        this.addAcceptedAndRejectedToolbarItems();
                    }
                }
                else if (this.approverGroupTypeId == ApproverGroupTypeMapType.CEO) {

                    if (this.currentApproverGroupTypeId == this.approverGroupTypeId) {
                        //accepted or rejected toolbar
                        this.addAcceptedAndRejectedToolbarItems();
                    }

                }
            }
            else if (this.loanStatusMapTypeId == LoanStatusMapType.Approved) {

                this.disableItem = true;
                this.addTagToApprovalConfiguration();

                if (this.approverGroupTypeId == ApproverGroupTypeMapType.CreditOfficer) {

                    if (this.isSubmittedToCreditAdministrator == false) {

                        //add send to credit administrator toolbar
                        this.addSendToCreditAdministratorToolbarItems();
                    }
                }
            }
            else if (this.loanStatusMapTypeId == LoanStatusMapType.Rejected) {

                this.disableItem = true;
                this.addTagToApprovalConfiguration();
            }
        }
        else {

        }
    }

    /*****************************  Credit Officer Start ******************************** */

    private addToolbarAdditionalItems() {

        var sendToApprovalItem = new ToolbarItem();
        sendToApprovalItem.location = 'after';
        sendToApprovalItem.widget = 'dxButton';
        sendToApprovalItem.locateInMenu = 'auto';
        sendToApprovalItem.visible = true;
        sendToApprovalItem.disabled = false;
        var sendToApprovalItemOption = new ToolbarItemOption();
        sendToApprovalItemOption.icon = 'revert';
        sendToApprovalItemOption.text = 'Send To Approval';
        sendToApprovalItemOption.onClick = () => {
            this.onMapToApprovalProcess();
        };
        sendToApprovalItem.options = sendToApprovalItemOption;
        this.toolbarAdditionalItems.push(sendToApprovalItem);
    }

    onMapToApprovalProcess(): void {

        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        else {
            this.saveRecordBeforeSendToApproval();
        }
    }

    saveRecordBeforeSendToApproval() {

        this.applicationDataSource.applicationCustomFields = this.temporaryDataSource;
        this.loanService.updateApplication("", this.applicationDataSource).subscribe(data => {           
            this.applicationId = data.result;
            this.entityModel.entityId = data.result;            
            this.sendToApprovalAfterSavingRecord();

        });

    }

    sendToApprovalAfterSavingRecord() {

        //var returnUrlWithId = "/loan/application/" + this.applicationId;       
        if (this.applicationId > 0) {
            this.loanService.mapApplicationToApprovalProcess(this.applicationDataSource).subscribe(data => {
                this.messageService.success("Record has been submitted for approval process successfully", 'Information');
                //this.init();
                window.location.reload();
            });
        }

    }

    /*****************************  Credit Officer End ******************************** */

    /*****************************  Branch Manager/DCEO/CEO Start ******************************** */

    private addAcceptedAndRejectedToolbarItems() {
        //Accepted
        var acceptedItem = new ToolbarItem();
        acceptedItem.location = 'after';
        acceptedItem.widget = 'dxButton';
        acceptedItem.locateInMenu = 'auto';
        acceptedItem.visible = true;
        acceptedItem.disabled = false;
        var acceptedItemOption = new ToolbarItemOption();
        acceptedItemOption.icon = 'check';
        acceptedItemOption.text = 'Accepted';
        acceptedItemOption.onClick = () => {
            this.acceptApprovalProcess();
        };
        acceptedItem.options = acceptedItemOption;
        this.toolbarAdditionalItems.push(acceptedItem);

        //Rejected
        var rejectedItem = new ToolbarItem();
        rejectedItem.location = 'after';
        rejectedItem.widget = 'dxButton';
        rejectedItem.locateInMenu = 'auto';
        rejectedItem.visible = true;
        rejectedItem.disabled = false;
        var rejectedItemOption = new ToolbarItemOption();
        rejectedItemOption.icon = 'remove';
        rejectedItemOption.text = 'Rejected';
        rejectedItemOption.onClick = () => {
            this.rejectApprovalProcess();
        };
        rejectedItem.options = rejectedItemOption;
        this.toolbarAdditionalItems.push(rejectedItem);
    }

    private acceptApprovalProcess(): void {


        if (this.applicationId > 0) {
            this.loanService.acceptApprovalProcess(this.applicationId, this.approvalMappingId).subscribe(data => {
                this.messageService.success("Record has been approved successfully", 'Information');
                //this.init();
                window.location.reload();
            });
        }
    }

    private rejectApprovalProcess(): void {

        if (this.applicationId > 0) {
            this.loanService.rejectApprovalProcess(this.applicationId, this.approvalMappingId).subscribe(data => {
                this.messageService.success("Record has been rejected successfully", 'Information');
                //this.init();
                window.location.reload();
            });
        }
    }

    private addSendToCreditAdministratorToolbarItems() {
        //Move Up
        var sendToCreditAdminItem = new ToolbarItem();
        sendToCreditAdminItem.location = 'after';
        sendToCreditAdminItem.widget = 'dxButton';
        sendToCreditAdminItem.locateInMenu = 'auto';
        sendToCreditAdminItem.visible = true;
        sendToCreditAdminItem.disabled = false;
        var sendToCreditAdminItemOption = new ToolbarItemOption();
        sendToCreditAdminItemOption.icon = 'revert';
        sendToCreditAdminItemOption.text = 'Send To Cr. Administrator';
        sendToCreditAdminItemOption.onClick = () => {
            this.submitToCreditAdministrator();
        };
        sendToCreditAdminItem.options = sendToCreditAdminItemOption;
        this.toolbarAdditionalItems.push(sendToCreditAdminItem);


    }

    private submitToCreditAdministrator(): void {

        if (this.applicationId > 0) {
            this.loanService.submitToCreditAdministrator(this.applicationId).subscribe(data => {
                this.messageService.success("Record has been submit to credit administrator successfully", 'Information');
                //this.init();
                window.location.reload();
            });
        }
    }

    private addAssigneeUpdateToolbarItems() {
        //
        var saveItem = new ToolbarItem();
        saveItem.location = 'after';
        saveItem.widget = 'dxButton';
        saveItem.locateInMenu = 'auto';
        saveItem.visible = true;
        saveItem.disabled = false;
        var saveItemOption = new ToolbarItemOption();
        saveItemOption.icon = 'save';
        saveItemOption.text = 'Save';
        saveItemOption.onClick = () => {
            this.validateAndSave(DetailPageAction.Save);
        };
        saveItem.options = saveItemOption;
        this.toolbarAdditionalItems.push(saveItem);
    }

    /*****************************  Branch Manager/DCEO/CEO End ******************************** */

    /*****************************  Credit Operation & Compliance Start ******************************** */



    private addSubmitToCreditOperationToolbarItems() {
        //Move Up
        var creditOperationSubmitItem = new ToolbarItem();
        creditOperationSubmitItem.location = 'after';
        creditOperationSubmitItem.widget = 'dxButton';
        creditOperationSubmitItem.locateInMenu = 'auto';
        creditOperationSubmitItem.visible = true;
        creditOperationSubmitItem.disabled = false;
        var creditOperationSubmitItemOption = new ToolbarItemOption();
        creditOperationSubmitItemOption.icon = 'revert';
        creditOperationSubmitItemOption.text = 'Send To Cr. Operation';
        creditOperationSubmitItemOption.onClick = () => {
            //this.onMapToApprovalProcess();
        };
        creditOperationSubmitItem.options = creditOperationSubmitItemOption;
        this.toolbarAdditionalItems.push(creditOperationSubmitItem);
    }

    private addCreditOperationToolbar() {

        //add clear credit operation, reject button, and submit to legal button

        //Accepted
        var clearCreditOperationItem = new ToolbarItem();
        clearCreditOperationItem.location = 'after';
        clearCreditOperationItem.widget = 'dxButton';
        clearCreditOperationItem.locateInMenu = 'auto';
        clearCreditOperationItem.visible = true;
        clearCreditOperationItem.disabled = false;
        var clearCreditOperationItemOption = new ToolbarItemOption();
        clearCreditOperationItemOption.icon = 'check';
        clearCreditOperationItemOption.text = 'Accepted';
        clearCreditOperationItemOption.onClick = () => {
            //this.onMapToApprovalProcess();
        };
        clearCreditOperationItem.options = clearCreditOperationItemOption;
        this.toolbarAdditionalItems.push(clearCreditOperationItem);

        //Rejected
        var rejectedItem = new ToolbarItem();
        rejectedItem.location = 'after';
        rejectedItem.widget = 'dxButton';
        rejectedItem.locateInMenu = 'auto';
        rejectedItem.visible = true;
        rejectedItem.disabled = false;
        var rejectedItemOption = new ToolbarItemOption();
        rejectedItemOption.icon = 'remove';
        rejectedItemOption.text = 'Rejected';
        rejectedItemOption.onClick = () => {
            //this.onMapToApprovalProcess();
        };
        rejectedItem.options = rejectedItemOption;
        this.toolbarAdditionalItems.push(rejectedItem);

        //Submit to legal Administrator
        var legalItem = new ToolbarItem();
        legalItem.location = 'after';
        legalItem.widget = 'dxButton';
        legalItem.locateInMenu = 'auto';
        legalItem.visible = true;
        legalItem.disabled = false;
        var legalItemOption = new ToolbarItemOption();
        legalItemOption.icon = 'revert';
        legalItemOption.text = 'Send To Compliance';
        legalItemOption.onClick = () => {
            //this.onMapToApprovalProcess();
        };
        legalItem.options = legalItemOption;
        this.toolbarAdditionalItems.push(legalItem);


    }

    private addLegalOperationToolbar() {

        //Accepted
        var acceptedItem = new ToolbarItem();
        acceptedItem.location = 'after';
        acceptedItem.widget = 'dxButton';
        acceptedItem.locateInMenu = 'auto';
        acceptedItem.visible = true;
        acceptedItem.disabled = false;
        var acceptedItemOption = new ToolbarItemOption();
        acceptedItemOption.icon = 'check';
        acceptedItemOption.text = 'Accepted';
        acceptedItemOption.onClick = () => {
            //this.onMapToApprovalProcess();
        };
        acceptedItem.options = acceptedItemOption;
        this.toolbarAdditionalItems.push(acceptedItem);

        //Rejected
        var rejectItem = new ToolbarItem();
        rejectItem.location = 'after';
        rejectItem.widget = 'dxButton';
        rejectItem.locateInMenu = 'auto';
        rejectItem.visible = true;
        rejectItem.disabled = false;
        var rejectItemOption = new ToolbarItemOption();
        rejectItemOption.icon = 'remove';
        rejectItemOption.text = 'Rejected';
        rejectItemOption.onClick = () => {
            //this.onMapToApprovalProcess();
        };
        rejectItem.options = rejectItemOption;
        this.toolbarAdditionalItems.push(rejectItem);
    }

    /*****************************  Credit Operation & Compliance End ******************************** */



    onCustomFieldvalueChanged(e, data) {
        //debugger;
        let exists = false;

        // iterate over each element in the array
        for (var i = 0; i < this.temporaryDataSource.length; i++) {

            if (this.temporaryDataSource[i].id == data.id) {
                //add to the targetted array
                //this.target.push(this.subCategorySelectItems[i]);
                this.temporaryDataSource[i].value = e.value;
                exists = true;
            }
        }

        if (!exists) {
            this.temporaryDataSource.push(data);
        }
    }

    validateAndSave(action: DetailPageAction): void {

        if (this.approvalStatusId > 0 && this.approvalStatusId != this.NotStarted) {

            if (!this.formValidation.instance.validate().isValid) {
                return;
            }

            this.saveEntity(action);
        }
        else {

            this.saveEntity(action);
        }
        
    }

    saveEntity(action: DetailPageAction): void {

        if (this.applicationId == 0) {
            this.loanService.createApplication("", this.applicationDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.applicationId = data.result;
                this.entityModel.entityId = data.result;
               // ValidationEngine.resetGroup("formValidation");
                this.redirectToListPage(action);

            });
        }
        else {

            if (this.approvalStatusId > 0 && this.approvalStatusId == this.InProgress) {
                this.applicationDataSource.currentAssigneeComments = this.questionsTextArea.value;
            }

            this.applicationDataSource.applicationCustomFields = this.temporaryDataSource;
            this.loanService.updateApplication("", this.applicationDataSource).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.applicationId = data.result;
                this.entityModel.entityId = data.result;
                this.questionsTextArea.value = null;
                //ValidationEngine.resetGroup("formValidation");
                this.init();
                this.redirectToListPage(action);

            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        //debugger;
        var newNavigationUrl = '/loan/application';


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

    getAssignedByPhotoUrl(data): any {

        var url = this.imageUrl;
        if (data.assignedByPhotoUrl != null)
            url = this.apiUrl + "/images/" + data.assignedByPhotoUrl;

        return url;
    }

    getAssignedToPhotoUrl(data): any {

        var url = this.imageUrl;
        if (data.assignedToPhotoUrl != null)
            url = this.apiUrl + "/images/" + data.assignedByPhotoUrl;

        return url;
    }

    onDeleteNote(data) {

        this.loanService.deleteNoteRecord(data.id).subscribe(data => {
            this.messageService.success("Note has been deleted successfully", 'Information');
            this.init();
        });
    }
}


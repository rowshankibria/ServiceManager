import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { DxValidationGroupComponent, DxValidatorComponent, DxTagBoxComponent } from 'devextreme-angular';

import { MessageService } from './../../../../../shared/services/message.service';
import { TitlebarComponent } from './../../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../../../application-shared/components/titlebar/utilities';
import { NavigationService } from '../../../../../shared/services/navigation.service';
import { EntityModel } from '../../../../system-service/models/entityModel';
import CustomStore from "devextreme/data/custom_store";
import { DxTextBoxComponent, DxSelectBoxComponent, DxDataGridComponent, DxDropDownBoxComponent, DxButtonComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { ApprovalProcessService } from '../../../services/approval-process.service';
declare var $: any;

@Component({
    selector: 'app-approval-process-form',
    templateUrl: './approval-process.form.component.html',
    styleUrls: ['./approval-process.form.component.scss'],
})

export class ApprovalProcessComponent implements OnInit {

    entityTitle: string = "Approval Process";
    approvalProcessId: any = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    contentClass: any = "detail-page-content-div";

    documentChecklists: DocumentChecklist[] = [];
    approvalProcessDataSource: any = [];
    approvalProcessStepDataSource: any = [];
    documentChecklistDataSoruce: any = [];
    documentChecklistEmptyDataSoruce: any = [];


    approverGroupSelectItems: any = [];
    documentChecklistSelectItems: any = [];
    approverGroupIds: any = [];
    documentCheckIds: any = [];
    selectedRowsApprovalProcess: any = [];

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('grdApprovalProcessStep')
    dataGrid: DxDataGridComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild('approverGroupSelection')
    private approverGroupSelection: DxSelectBoxComponent;
        
    @ViewChild('stepNameTextbox')
    private stepNameTextbox: DxTextBoxComponent;

    @ViewChild('documentChecklistTag')
    private documentChecklistTag: DxTagBoxComponent;


    constructor(private approvalProcessService: ApprovalProcessService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.route.params.subscribe(params => {
            if (params['Id'] !== undefined) {
                this.approvalProcessId = params['Id'];
                this.toolbarType = ToolbarType.DetailPage;
                this.contentClass = "detail-page-content-div";
            }
        });
       
    }     

    /**
     * get document by key value
     * @param key
     */
    getDocuments(key): any[] {       

        var dataSource = this.documentChecklistDataSoruce.filter(doc => doc.approvalProcessStepId == key.id);
        return dataSource;

        //let item = {
        //        key: key,
        //        dataSourceInstance: new DataSource({
        //            store: new ArrayStore({
        //                data: this.documentChecklistDataSoruce,
        //                key: "Id"
        //            }),
        //            filter: ["approvalProcessStepId", "=", key.id]
        //        })
        //    };
            
        //return item.dataSourceInstance;


        //let item = this.documentChecklistEmptyDataSoruce.find((i) => i.key === key);
        //if (!item) {
        //    item = {
        //        key: key,
        //        dataSourceInstance: new DataSource({
        //            store: new ArrayStore({
        //                data: this.documentChecklists,
        //                key: "Id"
        //            }),
        //            filter: ["EmployeeID", "=", key]
        //        })
        //    };
        //    this.documentChecklistEmptyDataSoruce.push(item)
        //}
        //return item.dataSourceInstance;
    }

    onMoveUp(): void {

        if (this.selectedRowsApprovalProcess != undefined && this.selectedRowsApprovalProcess.length > 0) {

            this.approvalProcessService.moveUp(this.selectedRowsApprovalProcess[0]["id"]).toPromise().then((response: any) => {
                if (response) {

                    this.dataGrid.instance.getDataSource().reload();
                    this.dataGrid.instance.clearSorting();
                    this.dataGrid.instance.columnOption('sortOrder', {
                        sortOrder: 'asc',
                        sortIndex: 1
                    });
                }
            });
        }
    }

    onMoveDown(): void {
        if (this.selectedRowsApprovalProcess != undefined && this.selectedRowsApprovalProcess.length > 0) {
            this.approvalProcessService.moveDown(this.selectedRowsApprovalProcess[0]["id"]).toPromise().then((response: any) => {
                if (response) {

                    this.dataGrid.instance.getDataSource().reload();
                    this.dataGrid.instance.clearSorting();
                    this.dataGrid.instance.columnOption('sortOrder', {
                        sortOrder: 'asc',
                        sortIndex: 1
                    });

                }
            });
        }
    }

    ngOnInit(): void {
        this.init();
    }

    ngAfterViewInit(): void {
        //this.formValidation.instance.validate();
        //this.attachValidationToControl();
    }

    addApprovalProcessStep(e) {
        //debugger;
        if (this.stepNameTextbox.value == "" || this.stepNameTextbox.value == null) {
            this.messageService.warning("Step Name is required", 'Validation');
        }
        else if (this.approverGroupSelection.value == undefined || this.approverGroupSelection.value == null || this.approverGroupSelection.value == 0) {

            this.messageService.error("Approver Group is required.", 'Validation');
        }        
        else {


            this.approvalProcessDataSource.documentCheckIds = this.documentCheckIds;
            this.approvalProcessService.createApprovalProcessStep(this.approvalProcessDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');

                this.stepNameTextbox.value = null;
                this.approverGroupSelection.value = null;
                this.documentCheckIds = [];
                this.dataGrid.instance.getDataSource().reload();
                this.init();
            });

        }
    }

    /**
     * attach validation to the controls
     *
     * */
    attachValidationToControl() {

        //if (this.loanTypeId > 0) {
        //    //validation        
        //    this.customFieldNameValidation.validationRules = [{ type: 'required', message: 'Custom Field Name is required.' }];
        //    this.customFieldCaptionValidation.validationRules = [{ type: 'required', message: 'Custom Field Caption is required.' }];
        //    this.customFieldControlTypeValidation.validationRules = [{ type: 'required', message: 'Custom Field Control Type is required.' }];
        //}
        //else {

        //    this.customFieldNameValidation.validationRules = [{ type: 'custom', validationCallback: this.validationCallback, }];
        //    this.customFieldCaptionValidation.validationRules = [{ type: 'custom', validationCallback: this.validationCallback, }];
        //    this.customFieldControlTypeValidation.validationRules = [{ type: 'custom', validationCallback: this.validationCallback, }];
        //}
    }

    validationCallback(e) {
        return true;
    }



    init(): void {

        this.approvalProcessService.getApprovalProcess(this.approvalProcessId).subscribe(data => {
            //debugger;
            this.approvalProcessDataSource = data.result.approvalProcessModel,
                this.approverGroupSelectItems = data.result.approverGroupSelectItems,
                this.documentChecklistSelectItems = data.result.checkListSelectItems,

                this.documentChecklistDataSoruce = data.result.approvalProcessModel.approvalProcessStepCheckList,
                this.documentCheckIds = data.result.approvalProcessModel.documentCheckIds,

                this.titlebar.initializeToolbar(this.approvalProcessId == 0 ? (this.entityTitle + " : New") : this.entityTitle + " : " + data.result.approvalProcessModel.name, null, this.toolbarType)
        });

        if (this.approvalProcessId > 0) {

            this.approvalProcessStepDataSource = new DataSource({

                load: (loadOptions: any) => {
                    return this.approvalProcessService.getApprovalProcessStepByApprovalProcessIdList(this.approvalProcessId, loadOptions).toPromise().then((response: any) => {
                        return {
                            data: response.result.data,
                            totalCount: response.result.totalCount
                        }

                    });
                }
            });
            
        }

    }


    validateAndSave(action: DetailPageAction): void {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    }


    saveEntity(action: DetailPageAction): void {

        //this.approvalProcessDataSource.employeeIds = this.employeeIds;

        if (this.approvalProcessId == 0) {
            this.approvalProcessService.createApprovalProcess(this.approvalProcessDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.approvalProcessId = data.result;
                this.redirectToListPage(action);
            });
        }
        else {
            this.approvalProcessService.updateApprovalProcess(this.approvalProcessDataSource).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.approvalProcessId = data.result;
                this.redirectToListPage(action);
            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        //debugger;
        var newNavigationUrl = '/system-settings/configuration/approval-process';
        var returnNavigationUrl = '/system-settings/configuration/approval-processes';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {
            this.navigationService.navigate(returnNavigationUrl);
        }
        else if (action == DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.approvalProcessId, this.router.url);
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


export class DocumentChecklist {
    id: number;
    approvalProcessStepId: number;
    documentChecklistId: number;
    title: any;
    description: any;
}

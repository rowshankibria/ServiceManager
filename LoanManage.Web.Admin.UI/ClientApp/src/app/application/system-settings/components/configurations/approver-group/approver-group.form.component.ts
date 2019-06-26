import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { DxValidationGroupComponent, DxValidatorComponent } from 'devextreme-angular';

import { MessageService } from './../../../../../shared/services/message.service';
import { TitlebarComponent } from './../../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../../../application-shared/components/titlebar/utilities';
import { NavigationService } from '../../../../../shared/services/navigation.service';
import { EntityModel } from '../../../../system-service/models/entityModel';
import CustomStore from "devextreme/data/custom_store";
import { DxTextBoxComponent, DxSelectBoxComponent, DxDataGridComponent, DxDropDownBoxComponent, DxButtonComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { ApproverGroupService } from '../../../services/approver-group.service';
declare var $: any;

@Component({
    selector: 'app-approver-group-form',
    templateUrl: './approver-group.form.component.html',
    styleUrls: ['./approver-group.form.component.scss'],
})

export class ApproverGroupComponent implements OnInit {

    entityTitle: string = "Approver Group";
    approverGroupId: any = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    contentClass: any = "detail-page-content-div";
    approverGroupDataSource: any = [];
    approverGroupTypeSelectItems: any = [];
    
    _gridSelectedRowKeys: number[] = [];
    gridDataSource: any;
    isDropDownBoxOpened = false;
    employeeIds: any = [];

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;



    constructor(private approverGroupService: ApproverGroupService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.route.params.subscribe(params => {
            if (params['Id'] !== undefined) {
                this.approverGroupId = params['Id'];
                this.toolbarType = ToolbarType.DetailPage;
                this.contentClass = "detail-page-content-div";                
            }
        });
    }


    /**
     * on value changed of business profile tag box
     * @param e
     */
    onApproverGroupTypeValueChanged(e): void {

        let newValue = e.value;
        if (newValue != null) {
            this.populateEmployeeOnApproverEntitySelectionChanged(newValue);
        }
    }

    /**
     * Populate employee on approver entity selection changed
     * @param id
     */
    populateEmployeeOnApproverEntitySelectionChanged(id: any) {
        this.gridDataSource = this.makeAsyncDataSource(id, this.approverGroupService);
    }

    get gridBoxValue(): number[] {
        return this.employeeIds;
    }

    set gridBoxValue(value: number[]) {

        this.employeeIds = value || [];
    }

    /**
     * make data source
     * @param id
     * @param practitionerService
     */
    makeAsyncDataSource(id: any, appGroupService: ApproverGroupService) {
        return new CustomStore({
            loadMode: "raw",
            key: "id",
            load: () => {
                return appGroupService.getEmployeeByApproverEntityType(id).toPromise().then((response: any) => {
                    //set employee value
                    if (this.approverGroupDataSource != undefined) {
                        this.setEmployeeValue(this.approverGroupDataSource.employeeIds);
                    }                    
                    return response;
                })
            }
        });
    };



    ngOnInit(): void {
        this.init();
    }

    ngAfterViewInit(): void {
        //this.formValidation.instance.validate();
        //this.attachValidationToControl();
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
        this.approverGroupService.getApproverGroup(this.approverGroupId).subscribe(data => {
            this.approverGroupDataSource = data.result.approverGroupModel,
                this.approverGroupTypeSelectItems = data.result.approverGroupTypeSelectItems,
                this.titlebar.initializeToolbar(this.approverGroupId == 0 ? (this.entityTitle + " : New") : this.entityTitle + " : " + data.result.approverGroupModel.name, null, this.toolbarType)
        });
        
    }
   

    /**
     * set employee value to combobox
     * @param employeeIds
     */
    setEmployeeValue(employeeIds: any[]) {
        this.employeeIds = employeeIds;
    }


    validateAndSave(action: DetailPageAction): void {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    }


    saveEntity(action: DetailPageAction): void {

        this.approverGroupDataSource.employeeIds = this.employeeIds;

        if (this.approverGroupId == 0) {
            this.approverGroupService.createApproverGroup(this.approverGroupDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.approverGroupId = data.result;
                this.redirectToListPage(action);                
            });
        }
        else {
            this.approverGroupService.updateApproverGroup(this.approverGroupDataSource).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.approverGroupId = data.result;
                this.redirectToListPage(action);                
            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        //debugger;
        var newNavigationUrl = '/system-settings/configuration/approver-group';
        var returnNavigationUrl = '/system-settings/configuration/approver-groups';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {
            this.navigationService.navigate(returnNavigationUrl);
        }
        else if (action == DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.approverGroupId, this.router.url);
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

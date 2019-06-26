import { Component, AfterViewInit, ViewChild, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DxValidationGroupComponent, DxValidatorComponent, DxCheckBoxComponent } from 'devextreme-angular';
import { LoanTypeService } from '../../../services/loan-type.service';
import { MessageService } from './../../../../../shared/services/message.service';
import { TitlebarComponent } from './../../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../../../application-shared/components/titlebar/utilities';
import { NavigationService } from '../../../../../shared/services/navigation.service';
import { EntityModel } from '../../../../system-service/models/entityModel';
import CustomStore from "devextreme/data/custom_store";
import { DxNumberBoxComponent, DxTextBoxComponent, DxTextAreaComponent, DxSelectBoxComponent, DxDataGridComponent, DxButtonComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import DataGrid from "devextreme/ui/data_grid";
declare var $: any;

@Component({
    selector: 'app-loan-type-form',
    templateUrl: './loantype-form.component.html',
    styleUrls: ['./loantype-form.component.scss'],
})

export class LoanTypeComponent implements OnInit {

    entityTitle: string = "Loan Type";
    loanTypeId: any = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    combobox: number = 2;
    radiobutton: number = 4;
    customFieldId: any = 0;

    tempDataSource: any = [];
    approvalProcessTypeSelectItems: any = [];
    documentCategoryTypeSelectItems: any = [];
    loanTypeDataSource: any = [];
    loanTypeCustomFieldDataSource: CustomFieldModel[];
    loanTypeCustomFieldsFinalDataSource: CustomFieldModel[];
    loanTypeGroupDataSource: CustomFieldModel[];
    loanTypeFieldDataSource: any = [];
    customFieldControlTypeSelectItems: any = [];
    customFieldGroupSelectItems: any = [];
    documentCategoryIds: any = [];

    selectedRowsForCustomField: any = [];

    contentClass: any = "detail-page-content-div";
    showGroup: any = "card mb-1 item-visible";
    hideGroup: any = "card mb-1 item-invisible";

    showItem: any = "row form-group item-visible";
    hideItem: any = "row form-group item-invisible";
    customFieldClass: any = this.hideItem;


    customFieldClassGroup: any = this.hideGroup;

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild('customFieldNameValidation')
    private customFieldNameValidation: DxValidatorComponent;

    @ViewChild('customFieldCaptionValidation')
    private customFieldCaptionValidation: DxValidatorComponent;

    @ViewChild('customFieldControlTypeValidation')
    private customFieldControlTypeValidation: DxValidatorComponent;

    @ViewChild('grdCustomField')
    private grdCustomField: DxDataGridComponent;

    @ViewChild('grdCustomGroupFields') grdCustomGroupFields: DxDataGridComponent;

    @ViewChild('customFieldName')
    private customFieldName: DxTextBoxComponent;

    @ViewChild('customFieldCaption')
    private customFieldCaption: DxTextBoxComponent;

    @ViewChild('customFieldControlType')
    private customFieldControlType: DxSelectBoxComponent;

    @ViewChild('customFieldControlValue')
    private customFieldControlValue: DxTextBoxComponent;

    @ViewChild('customFieldGroupName')
    private customFieldGroupName: DxTextBoxComponent;

    @ViewChild('customFieldControlSortOrder')
    private customFieldControlSortOrder: DxNumberBoxComponent;

    @ViewChild('customFieldMandatory')
    private customFieldMandatory: DxCheckBoxComponent;
    


    constructor(private loanTypeService: LoanTypeService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.loanTypeGroupDataSource = new Array<CustomFieldModel>();
        this.loanTypeCustomFieldsFinalDataSource = new Array<CustomFieldModel>();

        this.route.params.subscribe(params => {
            if (params['loanTypeId'] !== undefined) {
                this.loanTypeId = params['loanTypeId'];
                this.toolbarType = ToolbarType.DetailPage;
                this.contentClass = "detail-page-content-div";
                this.customFieldClassGroup = this.showGroup;
            }
        });

        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        } 
    }

    ngOnInit(): void {
        this.init();
    }

    ngAfterViewInit(): void {
        //this.formValidation.instance.validate();
        this.attachValidationToControl();
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

    //add custom field
    addCustomFiled(e): void {
        debugger;

        if (this.loanTypeId > 0) {

            if (this.customFieldGroupName.value == "" || this.customFieldName.value == "" || this.customFieldCaption.value == "" || this.customFieldControlType.value == null) {
                this.messageService.warning("Custom Field group name, name, caption and control type is required", 'Warning');
            }
            else if ((this.customFieldControlType.value == this.combobox || this.customFieldControlType.value == this.radiobutton)
                && this.customFieldControlValue.value == "") {
                this.messageService.warning("Control Selection Value is required", 'Warning');
            }
            else {
                var customFModel = new CustomFieldModel();
                customFModel.customFieldName = this.customFieldName.text;
                customFModel.customFieldCaption = this.customFieldCaption.text;
                customFModel.customFieldControlTypeId = this.customFieldControlType.value;                
                customFModel.customFieldGroupName = this.customFieldGroupName.value;
                customFModel.customFieldSelectionValue = this.customFieldControlValue.value;
                customFModel.isCustomFieldMandatory = this.customFieldMandatory.value;
                //customFModel.controlSortOrder = this.customFieldControlSortOrder.value;

                this.loanTypeDataSource.customFieldModel = customFModel;
                this.loanTypeService.createLoanTypeCustomField(this.loanTypeDataSource).subscribe(data => {
                    this.messageService.success("Record has been saved successfully", 'Information');
                    this.customFieldName.value = "";
                    this.customFieldCaption.value = "";
                    this.customFieldGroupName.value = "";
                    this.customFieldControlType.value = null;
                    this.customFieldControlValue.value = "";
                    this.customFieldControlSortOrder.value = 1;
                    this.customFieldMandatory.value = false;
                    this.selectedRowsForCustomField = [];
                    this.grdCustomField.instance.refresh();
                    this.init();
                });
            }
        }
    }

    clearCustomField(e): void {

        this.customFieldName.value = "";
        this.customFieldCaption.value = "";
        this.customFieldGroupName.value = "";
        this.customFieldControlType.value = null;
        this.customFieldControlValue.value = "";
        this.customFieldControlSortOrder.value = 1;
        this.customFieldMandatory.value = false;
        this.customFieldId = 0;
    }

    updateCustomField(e): void {
        //debugger;

        if (this.loanTypeId > 0) {

            //if custom field in edit mode
            if (this.customFieldId > 0) {

                if (this.customFieldGroupName.value == "" || this.customFieldName.value == "" || this.customFieldCaption.value == "" || this.customFieldControlType.value == null) {
                    this.messageService.warning("Custom Field group name, name, caption and control type is required", 'Warning');
                }
                else if ((this.customFieldControlType.value == this.combobox || this.customFieldControlType.value == this.radiobutton)
                    && this.customFieldControlValue.value == "") {
                    this.messageService.warning("Control Selection Value is required", 'Warning');
                }
                else {
                    var customFModel = new CustomFieldModel();
                    customFModel.id = this.customFieldId;
                    customFModel.customFieldName = this.customFieldName.text;
                    customFModel.customFieldCaption = this.customFieldCaption.text;
                    customFModel.customFieldControlTypeId = this.customFieldControlType.value;
                    customFModel.isCustomFieldMandatory = this.customFieldMandatory.value;
                    customFModel.customFieldGroupName = this.customFieldGroupName.value;
                    customFModel.customFieldSelectionValue = this.customFieldControlValue.value;
                    customFModel.controlSortOrder = this.customFieldControlSortOrder.value;
                    this.loanTypeDataSource.customFieldModel = customFModel;
                    this.loanTypeDataSource.customFieldGroupSelectItems = this.customFieldGroupSelectItems;

                    this.loanTypeService.updateCustomField(this.loanTypeDataSource).subscribe(data => {
                        this.messageService.success("Record has been saved successfully", 'Information');
                        this.customFieldName.value = "";
                        this.customFieldCaption.value = "";
                        this.customFieldGroupName.value = "";
                        this.customFieldControlType.value = null;
                        this.customFieldControlValue.value = "";
                        this.customFieldControlSortOrder.value = 1;
                        this.customFieldMandatory.value = false;
                        this.customFieldId = 0;
                        this.selectedRowsForCustomField = [];
                        this.grdCustomField.instance.refresh();
                        this.init();
                    });
                }
            }
            //if custom field has no edit mode but group sort order should be update
            else {
                this.loanTypeDataSource.customFieldGroupSelectItems = this.customFieldGroupSelectItems;
                this.loanTypeService.updateGroup(this.loanTypeDataSource).subscribe(data => {
                    this.messageService.success("Record has been saved successfully", 'Information');
                    this.customFieldName.value = "";
                    this.customFieldCaption.value = "";
                    this.customFieldGroupName.value = "";
                    this.customFieldControlType.value = null;
                    this.customFieldControlValue.value = "";
                    this.customFieldControlSortOrder.value = 1;
                    this.customFieldMandatory.value = false;
                    this.customFieldId = 0;
                    this.init();
                });
            }
        }
    }

    init(): void {
        this.loanTypeService.getLoanType(this.loanTypeId).subscribe(data => {
            this.loanTypeDataSource = data.result.loanTypeModel,
                this.customFieldControlTypeSelectItems = data.result.customFieldControlTypeSelectItems,
                this.approvalProcessTypeSelectItems = data.result.approvalProcessTypeSelectItems,
                this.customFieldGroupSelectItems = data.result.customFieldGroupSelectItems,
                this.documentCategoryTypeSelectItems = data.result.documentCategoryTypeSelectItems,
                this.documentCategoryIds = data.result.loanTypeModel.documentCategoryIds,
                this.titlebar.initializeToolbar(this.loanTypeId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.result.loanTypeModel.name, null, this.toolbarType)
        });

        this.loadCustomFieldDataSource();
    }

    /**
    * load custom field data source
    * */
    loadCustomFieldDataSource(): void {
        if (this.loanTypeId !== undefined && this.loanTypeId !== null && this.loanTypeId != 0) {
            this.loanTypeCustomFieldsFinalDataSource = new Array<CustomFieldModel>();
            this.loanTypeService.getCustomFieldsByLoanType(this.loanTypeId).toPromise().then((response: any) => {
                this.loanTypeCustomFieldDataSource = response.result;

                this.loanTypeCustomFieldDataSource.forEach(item => {
                    if (this.loanTypeGroupDataSource.findIndex(c => c.customFieldGroupName == item.customFieldGroupName) < 0) {
                        this.loanTypeGroupDataSource.push(item);
                    }
                });

                this.loanTypeCustomFieldsFinalDataSource = this.loanTypeGroupDataSource;
            });
        }
    }

    fieldsDataSource: any;
    getGroupFields(key) {
        let item = this.loanTypeFieldDataSource.find((i) => i.customFieldGroupName === key);
        if (!item) {
            item = {
                customFieldGroupName: key,
                dataSourceInstance: new DataSource({
                    store: new ArrayStore({
                        data: this.loanTypeCustomFieldDataSource,
                        key: "customFieldGroupName"
                    }),
                    filter: ["customFieldGroupName", "=", key]
                })
            };
            this.loanTypeFieldDataSource.push(item)
        }

        return item.dataSourceInstance;
    }

    /**
   * go to detail page udate record
   * @param data
   */
    onEditClicked(data: any) {
        this.loanTypeService.getCustomFieldDetail(data.data.id).subscribe(data => {
            this.setCustomFieldValueToControl(data.result);
        });
    }

    setCustomFieldValueToControl(obj) {
        //debugger;
        this.customFieldName.value = obj.customFieldName;
        this.customFieldCaption.value = obj.customFieldCaption;
        this.customFieldGroupName.value = obj.customFieldGroupName;
        this.customFieldControlType.value = obj.customFieldControlTypeId;
        this.customFieldControlValue.value = obj.customFieldSelectionValue;
        this.customFieldControlSortOrder.value = obj.controlSortOrder;
        this.customFieldMandatory.value = obj.isCustomFieldMandatory;

        this.customFieldId = obj.id;
    }

    /**
    * go to detail page udate record
    * @param data
    */
    onDeleteClicked(data: any) {
        this.tempDataSource = data;
        var result = this.messageService.showDeleteConfirmMsg(1);
        result.then(dialogResult => {
            if (dialogResult) {
                this.deleteRecord();
            }
        });
    }

    /**
    * delete records
    **/
    deleteRecord(): void {
        let data = this.tempDataSource;
        this.loanTypeService.deleteLoanTypeCustomFieldDetail(data.data.id).subscribe(data => {
            this.messageService.success("Record has been save successfully", 'Information');
            this.selectedRowsForCustomField = [];
            this.grdCustomField.instance.refresh();
            this.init();
        });

    }

    validateAndSave(action: DetailPageAction): void {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    }

    saveEntity(action: DetailPageAction): void {
        if (this.loanTypeId == 0) {

            this.loanTypeDataSource.documentCategoryIds = this.documentCategoryIds;
            this.loanTypeService.createLoanType(this.loanTypeDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.loanTypeId = data.result;
                this.redirectToListPage(action);
                this.customFieldClassGroup = this.showGroup;
            });
        }
        else {

            this.loanTypeDataSource.documentCategoryIds = this.documentCategoryIds;
            this.loanTypeService.updateLoanType(this.loanTypeDataSource).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.loanTypeId = data.result;
                this.redirectToListPage(action);
                this.selectedRowsForCustomField = [];
                this.grdCustomField.instance.refresh();
                this.customFieldClassGroup = this.showGroup;
            });
        }
    }

    reloadPage() {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
    }

    onGroupUpClicked(data: CustomFieldModel): void {
        if (data.groupSortOrder > 0) {
            this.loanTypeService.updateGroupOrFieldOrder(this.loanTypeId, data.customFieldGroupName, data.id, false, true).subscribe(data => {
                if (data.result) {
                    this.messageService.success("Group order has been updated successfully", 'Information');
                    this.loanTypeCustomFieldsFinalDataSource = null;
                    this.reloadPage();
                }
                else {
                    this.messageService.error("An error has occurred while changing group order", 'Error');
                }
            });
        }
    }

    onGroupDownClicked(data: CustomFieldModel): void {
        this.loanTypeService.updateGroupOrFieldOrder(this.loanTypeId, data.customFieldGroupName, data.id, true, true).subscribe(data => {
            if (data.result) {
                this.messageService.success("Group order has been updated successfully", 'Information');
                this.loanTypeCustomFieldsFinalDataSource = null
                this.reloadPage();
            }
            else {
                this.messageService.error("An error has occurred while changing group order", 'Error');
            }
        });
    }

    onFieldUpClicked(data: CustomFieldModel): void {
        if (data.controlSortOrder > 0) {
            this.loanTypeService.updateGroupOrFieldOrder(this.loanTypeId, data.customFieldGroupName, data.id, false, false).subscribe(data => {
                if (data.result) {
                    this.messageService.success("Control order has been updated successfully", 'Information');
                    this.loanTypeCustomFieldsFinalDataSource = null
                    this.reloadPage();
                }
                else {
                    this.messageService.error("An error has occurred while changing control order", 'Error');
                }
            });
        }
    }

    onFieldDownClicked(data: CustomFieldModel): void {
        this.loanTypeService.updateGroupOrFieldOrder(this.loanTypeId, data.customFieldGroupName, data.id, true, false).subscribe(data => {
            if (data.result) {
                this.messageService.success("Control order has been updated successfully", 'Information');
                this.loanTypeCustomFieldsFinalDataSource = null
                this.reloadPage();
            }
            else {
                this.messageService.error("An error has occurred while changing Control order", 'Error');
            }
        });
    }

    updateCustomFieldOrGroupOrder(loanTypeId: number, groupName: string, controlTypeId: number, isDown: boolean, isGroupSort: boolean) {
        this.loanTypeService.updateGroupOrFieldOrder(loanTypeId, groupName, controlTypeId, isDown, isGroupSort).subscribe(data => {
            this.messageService.success("Position has been updated successfully", 'Information');
            this.grdCustomGroupFields.instance.refresh();
            this.init();
        });
    }

    redirectToListPage(action: DetailPageAction): void {
        //debugger;
        var newNavigationUrl = '/system-settings/configuration/loan-type';
        var returnNavigationUrl = '/system-settings/configuration/loan-types';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {
            this.navigationService.navigate(returnNavigationUrl);
        }
        else if (action == DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.loanTypeId, this.router.url);
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

    onControlTypeChanged(e) {
        if (e.value == this.combobox || e.value == this.radiobutton) {
            this.customFieldClass = this.showItem;
        }
        else {
            this.customFieldClass = this.hideItem;
        }
    }
}

export class CustomFieldModel {
    id: any;
    customFieldName: any;
    customFieldCaption: any;
    customFieldControlTypeId: any;
    isCustomFieldMandatory: any;
    customFieldGroupName: any;
    customFieldSelectionValue: any;
    groupSortOrder: any;
    controlSortOrder: any;    
}

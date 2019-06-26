"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var titlebar_component_1 = require("./../../../../application-shared/components/titlebar/titlebar.component");
var utilities_1 = require("./../../../../application-shared/components/titlebar/utilities");
var LoanTypeComponent = /** @class */ (function () {
    function LoanTypeComponent(loanTypeService, messageService, navigationService, route, router) {
        var _this = this;
        this.loanTypeService = loanTypeService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.entityTitle = "Loan Type";
        this.loanTypeId = 0;
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.combobox = 2;
        this.radiobutton = 4;
        this.customFieldId = 0;
        this.tempDataSource = [];
        this.approvalProcessTypeSelectItems = [];
        this.loanTypeDataSource = [];
        this.loanTypeCustomFieldDataSource = [];
        this.customFieldControlTypeSelectItems = [];
        this.customFieldGroupSelectItems = [];
        this.selectedRowsForCustomField = [];
        this.contentClass = "detail-page-content-div";
        this.showGroup = "card mb-1 item-visible";
        this.hideGroup = "card mb-1 item-invisible";
        this.showItem = "row form-group item-visible";
        this.hideItem = "row form-group item-invisible";
        this.customFieldClass = this.hideItem;
        this.customFieldClassGroup = this.hideGroup;
        this.route.params.subscribe(function (params) {
            if (params['loanTypeId'] !== undefined) {
                _this.loanTypeId = params['loanTypeId'];
                _this.toolbarType = utilities_1.ToolbarType.DetailPage;
                _this.contentClass = "detail-page-content-div";
                _this.customFieldClassGroup = _this.showGroup;
            }
        });
    }
    LoanTypeComponent.prototype.ngOnInit = function () {
        this.init();
    };
    LoanTypeComponent.prototype.ngAfterViewInit = function () {
        //this.formValidation.instance.validate();
        this.attachValidationToControl();
    };
    /**
     * attach validation to the controls
     *
     * */
    LoanTypeComponent.prototype.attachValidationToControl = function () {
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
    };
    LoanTypeComponent.prototype.validationCallback = function (e) {
        return true;
    };
    //add custom field
    LoanTypeComponent.prototype.addCustomFiled = function (e) {
        var _this = this;
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
                customFModel.isCustomFieldMandatory = true;
                customFModel.customFieldGroupName = this.customFieldGroupName.value;
                customFModel.customFieldSelectionValue = this.customFieldControlValue.value;
                customFModel.controlSortOrder = this.customFieldControlSortOrder.value;
                this.loanTypeDataSource.customFieldModel = customFModel;
                this.loanTypeService.createLoanTypeCustomField(this.loanTypeDataSource).subscribe(function (data) {
                    _this.messageService.success("Record has been saved successfully", 'Information');
                    _this.customFieldName.value = "";
                    _this.customFieldCaption.value = "";
                    _this.customFieldGroupName.value = "";
                    _this.customFieldControlType.value = null;
                    _this.customFieldControlValue.value = "";
                    _this.customFieldControlSortOrder.value = 1;
                    _this.selectedRowsForCustomField = [];
                    _this.grdCustomField.instance.refresh();
                    _this.init();
                });
            }
        }
    };
    LoanTypeComponent.prototype.clearCustomField = function (e) {
        this.customFieldName.value = "";
        this.customFieldCaption.value = "";
        this.customFieldGroupName.value = "";
        this.customFieldControlType.value = null;
        this.customFieldControlValue.value = "";
        this.customFieldControlSortOrder.value = 1;
        this.customFieldId = 0;
    };
    LoanTypeComponent.prototype.updateCustomField = function (e) {
        //debugger;
        var _this = this;
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
                    customFModel.isCustomFieldMandatory = true;
                    customFModel.customFieldGroupName = this.customFieldGroupName.value;
                    customFModel.customFieldSelectionValue = this.customFieldControlValue.value;
                    customFModel.controlSortOrder = this.customFieldControlSortOrder.value;
                    this.loanTypeDataSource.customFieldModel = customFModel;
                    this.loanTypeDataSource.customFieldGroupSelectItems = this.customFieldGroupSelectItems;
                    this.loanTypeService.updateCustomField(this.loanTypeDataSource).subscribe(function (data) {
                        _this.messageService.success("Record has been saved successfully", 'Information');
                        _this.customFieldName.value = "";
                        _this.customFieldCaption.value = "";
                        _this.customFieldGroupName.value = "";
                        _this.customFieldControlType.value = null;
                        _this.customFieldControlValue.value = "";
                        _this.customFieldControlSortOrder.value = 1;
                        _this.customFieldId = 0;
                        _this.selectedRowsForCustomField = [];
                        _this.grdCustomField.instance.refresh();
                        _this.init();
                    });
                }
            }
            //if custom field has no edit mode but group sort order should be update
            else {
                this.loanTypeDataSource.customFieldGroupSelectItems = this.customFieldGroupSelectItems;
                this.loanTypeService.updateGroup(this.loanTypeDataSource).subscribe(function (data) {
                    _this.messageService.success("Record has been saved successfully", 'Information');
                    _this.customFieldName.value = "";
                    _this.customFieldCaption.value = "";
                    _this.customFieldGroupName.value = "";
                    _this.customFieldControlType.value = null;
                    _this.customFieldControlValue.value = "";
                    _this.customFieldControlSortOrder.value = 1;
                    _this.customFieldId = 0;
                    _this.init();
                });
            }
        }
    };
    LoanTypeComponent.prototype.init = function () {
        var _this = this;
        this.loanTypeService.getLoanType(this.loanTypeId).subscribe(function (data) {
            _this.loanTypeDataSource = data.result.loanTypeModel,
                _this.customFieldControlTypeSelectItems = data.result.customFieldControlTypeSelectItems,
                _this.approvalProcessTypeSelectItems = data.result.approvalProcessTypeSelectItems,
                _this.customFieldGroupSelectItems = data.result.customFieldGroupSelectItems,
                _this.titlebar.initializeToolbar(_this.loanTypeId == 0 ? (_this.entityTitle + ": New") : _this.entityTitle + ": " + data.result.loanTypeModel.name, null, _this.toolbarType);
        });
        this.loadCustomFieldDataSource();
    };
    /**
    * load custom field data source
    * */
    LoanTypeComponent.prototype.loadCustomFieldDataSource = function () {
        var _this = this;
        if (this.loanTypeId !== undefined && this.loanTypeId !== null && this.loanTypeId != 0) {
            //this.loanTypeCustomFieldDataSource = new DataSource({
            //    load: (loadOptions: any) => {
            //        return this.loanTypeService.getLoanTypeCustomFieldByLoanTypeId(this.loanTypeId, loadOptions).toPromise().then((response: any) => {
            //            return {
            //                data: response.result.data,
            //                totalCount: response.result.totalCount
            //            }
            //        });
            //    }
            //});
            this.loanTypeService.getCustomFieldsByLoanType(this.loanTypeId).toPromise().then(function (response) {
                _this.loanTypeCustomFieldDataSource = response.result;
            });
        }
    };
    LoanTypeComponent.prototype.getGroupFields = function (key) {
        //let item = this.loanTypeCustomFieldDataSource.find((i) => i.key === key);
        //if (!item) {
        //    item = {
        //        key: key,
        //        dataSourceInstance: new DataSource({
        //            store: new ArrayStore({
        //                data: this.tasks,
        //                key: "ID"
        //            }),
        //            filter: ["EmployeeID", "=", key]
        //        })
        //    };
        //    this.tasksDataSourceStorage.push(item)
        //}
        return this.loanTypeCustomFieldDataSource.find(function (i) { return i.customFieldGroupName == key; });
    };
    /**
   * go to detail page udate record
   * @param data
   */
    LoanTypeComponent.prototype.onEditClicked = function (data) {
        //getCustomFieldDetail
        var _this = this;
        this.loanTypeService.getCustomFieldDetail(data.key).subscribe(function (data) {
            _this.setCustomFieldValueToControl(data.result);
        });
    };
    LoanTypeComponent.prototype.setCustomFieldValueToControl = function (obj) {
        //debugger;
        this.customFieldName.value = obj.customFieldName;
        this.customFieldCaption.value = obj.customFieldCaption;
        this.customFieldGroupName.value = obj.customFieldGroupName;
        this.customFieldControlType.value = obj.customFieldControlTypeId;
        this.customFieldControlValue.value = obj.customFieldSelectionValue;
        this.customFieldControlSortOrder.value = obj.controlSortOrder;
        this.customFieldId = obj.id;
    };
    /**
    * go to detail page udate record
    * @param data
    */
    LoanTypeComponent.prototype.onDeleteClicked = function (data) {
        var _this = this;
        this.tempDataSource = data;
        var result = this.messageService.showDeleteConfirmMsg(1);
        result.then(function (dialogResult) {
            if (dialogResult) {
                _this.deleteRecord();
            }
        });
    };
    /**
    * delete records
    **/
    LoanTypeComponent.prototype.deleteRecord = function () {
        var _this = this;
        var data = this.tempDataSource;
        this.loanTypeService.deleteLoanTypeCustomFieldDetail(data.key.id).subscribe(function (data) {
            _this.messageService.success("Record has been save successfully", 'Information');
            _this.selectedRowsForCustomField = [];
            _this.grdCustomField.instance.refresh();
        });
    };
    LoanTypeComponent.prototype.validateAndSave = function (action) {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    };
    LoanTypeComponent.prototype.saveEntity = function (action) {
        var _this = this;
        if (this.loanTypeId == 0) {
            this.loanTypeService.createLoanType(this.loanTypeDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been saved successfully", 'Information');
                _this.loanTypeId = data.result;
                _this.redirectToListPage(action);
                _this.customFieldClassGroup = _this.showGroup;
            });
        }
        else {
            this.loanTypeService.updateLoanType(this.loanTypeDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been updated successfully", 'Information');
                _this.loanTypeId = data.result;
                _this.redirectToListPage(action);
                _this.selectedRowsForCustomField = [];
                _this.grdCustomField.instance.refresh();
                _this.customFieldClassGroup = _this.showGroup;
            });
        }
    };
    LoanTypeComponent.prototype.redirectToListPage = function (action) {
        //debugger;
        var newNavigationUrl = '/system-settings/configuration/loan-type';
        var returnNavigationUrl = '/system-settings/configuration/loan-types';
        if (action == utilities_1.DetailPageAction.Close || action == utilities_1.DetailPageAction.SaveAndClose) {
            this.navigationService.navigate(returnNavigationUrl);
        }
        else if (action == utilities_1.DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.loanTypeId, this.router.url);
        }
    };
    LoanTypeComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    LoanTypeComponent.prototype.onSaveNNewClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    LoanTypeComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    LoanTypeComponent.prototype.onCloseClicked = function (e) {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    LoanTypeComponent.prototype.onControlTypeChanged = function (e) {
        if (e.value == this.combobox || e.value == this.radiobutton) {
            this.customFieldClass = this.showItem;
        }
        else {
            this.customFieldClass = this.hideItem;
        }
    };
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], LoanTypeComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild('formValidation')
    ], LoanTypeComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.ViewChild('customFieldNameValidation')
    ], LoanTypeComponent.prototype, "customFieldNameValidation", void 0);
    __decorate([
        core_1.ViewChild('customFieldCaptionValidation')
    ], LoanTypeComponent.prototype, "customFieldCaptionValidation", void 0);
    __decorate([
        core_1.ViewChild('customFieldControlTypeValidation')
    ], LoanTypeComponent.prototype, "customFieldControlTypeValidation", void 0);
    __decorate([
        core_1.ViewChild('grdCustomField')
    ], LoanTypeComponent.prototype, "grdCustomField", void 0);
    __decorate([
        core_1.ViewChild('customFieldName')
    ], LoanTypeComponent.prototype, "customFieldName", void 0);
    __decorate([
        core_1.ViewChild('customFieldCaption')
    ], LoanTypeComponent.prototype, "customFieldCaption", void 0);
    __decorate([
        core_1.ViewChild('customFieldControlType')
    ], LoanTypeComponent.prototype, "customFieldControlType", void 0);
    __decorate([
        core_1.ViewChild('customFieldControlValue')
    ], LoanTypeComponent.prototype, "customFieldControlValue", void 0);
    __decorate([
        core_1.ViewChild('customFieldGroupName')
    ], LoanTypeComponent.prototype, "customFieldGroupName", void 0);
    __decorate([
        core_1.ViewChild('customFieldControlSortOrder')
    ], LoanTypeComponent.prototype, "customFieldControlSortOrder", void 0);
    LoanTypeComponent = __decorate([
        core_1.Component({
            selector: 'app-loan-type-form',
            templateUrl: './loantype-form.component.html',
            styleUrls: ['./loantype-form.component.scss'],
        })
    ], LoanTypeComponent);
    return LoanTypeComponent;
}());
exports.LoanTypeComponent = LoanTypeComponent;
var CustomFieldModel = /** @class */ (function () {
    function CustomFieldModel() {
    }
    return CustomFieldModel;
}());
exports.CustomFieldModel = CustomFieldModel;
//# sourceMappingURL=loantype-form.component.js.map
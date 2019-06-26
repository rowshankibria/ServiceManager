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
var data_source_1 = require("devextreme/data/data_source");
var ApprovalProcessComponent = /** @class */ (function () {
    function ApprovalProcessComponent(approvalProcessService, messageService, navigationService, route, router) {
        var _this = this;
        this.approvalProcessService = approvalProcessService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.entityTitle = "Approval Process";
        this.approvalProcessId = 0;
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.contentClass = "detail-page-content-div";
        this.documentChecklists = [];
        this.approvalProcessDataSource = [];
        this.approvalProcessStepDataSource = [];
        this.documentChecklistDataSoruce = [];
        this.documentChecklistEmptyDataSoruce = [];
        this.approverGroupSelectItems = [];
        this.documentChecklistSelectItems = [];
        this.approverGroupIds = [];
        this.documentCheckIds = [];
        this.selectedRowsApprovalProcess = [];
        this.route.params.subscribe(function (params) {
            if (params['Id'] !== undefined) {
                _this.approvalProcessId = params['Id'];
                _this.toolbarType = utilities_1.ToolbarType.DetailPage;
                _this.contentClass = "detail-page-content-div";
            }
        });
    }
    /**
     * get document by key value
     * @param key
     */
    ApprovalProcessComponent.prototype.getDocuments = function (key) {
        var dataSource = this.documentChecklistDataSoruce.filter(function (doc) { return doc.approvalProcessStepId == key.id; });
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
    };
    ApprovalProcessComponent.prototype.onMoveUp = function () {
        var _this = this;
        if (this.selectedRowsApprovalProcess != undefined && this.selectedRowsApprovalProcess.length > 0) {
            this.approvalProcessService.moveUp(this.selectedRowsApprovalProcess[0]["id"]).toPromise().then(function (response) {
                if (response) {
                    _this.dataGrid.instance.getDataSource().reload();
                    _this.dataGrid.instance.clearSorting();
                    _this.dataGrid.instance.columnOption('sortOrder', {
                        sortOrder: 'asc',
                        sortIndex: 1
                    });
                }
            });
        }
    };
    ApprovalProcessComponent.prototype.onMoveDown = function () {
        var _this = this;
        if (this.selectedRowsApprovalProcess != undefined && this.selectedRowsApprovalProcess.length > 0) {
            this.approvalProcessService.moveDown(this.selectedRowsApprovalProcess[0]["id"]).toPromise().then(function (response) {
                if (response) {
                    _this.dataGrid.instance.getDataSource().reload();
                    _this.dataGrid.instance.clearSorting();
                    _this.dataGrid.instance.columnOption('sortOrder', {
                        sortOrder: 'asc',
                        sortIndex: 1
                    });
                }
            });
        }
    };
    ApprovalProcessComponent.prototype.ngOnInit = function () {
        this.init();
    };
    ApprovalProcessComponent.prototype.ngAfterViewInit = function () {
        this.formValidation.instance.validate();
        //this.attachValidationToControl();
    };
    ApprovalProcessComponent.prototype.addApprovalProcessStep = function (e) {
        var _this = this;
        //debugger;
        if (this.stepNameTextbox.value == "" || this.stepNameTextbox.value == null) {
            this.messageService.warning("Step Name is required", 'Validation');
        }
        else if (this.approverGroupSelection.value == undefined || this.approverGroupSelection.value == null || this.approverGroupSelection.value == 0) {
            this.messageService.error("Approver Group is required.", 'Validation');
        }
        else {
            this.approvalProcessDataSource.documentCheckIds = this.documentCheckIds;
            this.approvalProcessService.createApprovalProcessStep(this.approvalProcessDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been saved successfully", 'Information');
                _this.stepNameTextbox.value = null;
                _this.approverGroupSelection.value = null;
                _this.documentCheckIds = [];
                _this.dataGrid.instance.getDataSource().reload();
                _this.init();
            });
        }
    };
    /**
     * attach validation to the controls
     *
     * */
    ApprovalProcessComponent.prototype.attachValidationToControl = function () {
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
    ApprovalProcessComponent.prototype.validationCallback = function (e) {
        return true;
    };
    ApprovalProcessComponent.prototype.init = function () {
        var _this = this;
        this.approvalProcessService.getApprovalProcess(this.approvalProcessId).subscribe(function (data) {
            //debugger;
            _this.approvalProcessDataSource = data.result.approvalProcessModel,
                _this.approverGroupSelectItems = data.result.approverGroupSelectItems,
                _this.documentChecklistSelectItems = data.result.checkListSelectItems,
                _this.documentChecklistDataSoruce = data.result.approvalProcessModel.approvalProcessStepCheckList,
                _this.documentCheckIds = data.result.approvalProcessModel.documentCheckIds,
                _this.titlebar.initializeToolbar(_this.approvalProcessId == 0 ? (_this.entityTitle + " : New") : _this.entityTitle + " : " + data.result.approvalProcessModel.name, null, _this.toolbarType);
        });
        if (this.approvalProcessId > 0) {
            this.approvalProcessStepDataSource = new data_source_1.default({
                load: function (loadOptions) {
                    return _this.approvalProcessService.getApprovalProcessStepByApprovalProcessIdList(_this.approvalProcessId, loadOptions).toPromise().then(function (response) {
                        return {
                            data: response.result.data,
                            totalCount: response.result.totalCount
                        };
                    });
                }
            });
        }
    };
    ApprovalProcessComponent.prototype.validateAndSave = function (action) {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    };
    ApprovalProcessComponent.prototype.saveEntity = function (action) {
        //this.approvalProcessDataSource.employeeIds = this.employeeIds;
        var _this = this;
        if (this.approvalProcessId == 0) {
            this.approvalProcessService.createApprovalProcess(this.approvalProcessDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been saved successfully", 'Information');
                _this.approvalProcessId = data.result;
                _this.redirectToListPage(action);
            });
        }
        else {
            this.approvalProcessService.updateApprovalProcess(this.approvalProcessDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been updated successfully", 'Information');
                _this.approvalProcessId = data.result;
                _this.redirectToListPage(action);
            });
        }
    };
    ApprovalProcessComponent.prototype.redirectToListPage = function (action) {
        //debugger;
        var newNavigationUrl = '/system-settings/configuration/approval-process';
        var returnNavigationUrl = '/system-settings/configuration/approval-processes';
        if (action == utilities_1.DetailPageAction.Close || action == utilities_1.DetailPageAction.SaveAndClose) {
            this.navigationService.navigate(returnNavigationUrl);
        }
        else if (action == utilities_1.DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.approvalProcessId, this.router.url);
        }
    };
    ApprovalProcessComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    ApprovalProcessComponent.prototype.onSaveNNewClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    ApprovalProcessComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    ApprovalProcessComponent.prototype.onCloseClicked = function (e) {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], ApprovalProcessComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild('grdApprovalProcessStep')
    ], ApprovalProcessComponent.prototype, "dataGrid", void 0);
    __decorate([
        core_1.ViewChild('formValidation')
    ], ApprovalProcessComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.ViewChild('approverGroupSelection')
    ], ApprovalProcessComponent.prototype, "approverGroupSelection", void 0);
    __decorate([
        core_1.ViewChild('stepNameTextbox')
    ], ApprovalProcessComponent.prototype, "stepNameTextbox", void 0);
    __decorate([
        core_1.ViewChild('documentChecklistTag')
    ], ApprovalProcessComponent.prototype, "documentChecklistTag", void 0);
    ApprovalProcessComponent = __decorate([
        core_1.Component({
            selector: 'app-approval-process-form',
            templateUrl: './approval-process.form.component.html',
            styleUrls: ['./approval-process.form.component.scss'],
        })
    ], ApprovalProcessComponent);
    return ApprovalProcessComponent;
}());
exports.ApprovalProcessComponent = ApprovalProcessComponent;
var DocumentChecklist = /** @class */ (function () {
    function DocumentChecklist() {
    }
    return DocumentChecklist;
}());
exports.DocumentChecklist = DocumentChecklist;
//# sourceMappingURL=approval-process.form.component.js.map
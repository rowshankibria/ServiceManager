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
var custom_store_1 = require("devextreme/data/custom_store");
var ApproverGroupComponent = /** @class */ (function () {
    function ApproverGroupComponent(approverGroupService, messageService, navigationService, route, router) {
        var _this = this;
        this.approverGroupService = approverGroupService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.entityTitle = "Approver Group";
        this.approverGroupId = 0;
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.contentClass = "detail-page-content-div";
        this.approverGroupDataSource = [];
        this.approverGroupTypeSelectItems = [];
        this._gridSelectedRowKeys = [];
        this.isDropDownBoxOpened = false;
        this.employeeIds = [];
        this.route.params.subscribe(function (params) {
            if (params['Id'] !== undefined) {
                _this.approverGroupId = params['Id'];
                _this.toolbarType = utilities_1.ToolbarType.DetailPage;
                _this.contentClass = "detail-page-content-div";
            }
        });
    }
    /**
     * on value changed of business profile tag box
     * @param e
     */
    ApproverGroupComponent.prototype.onApproverGroupTypeValueChanged = function (e) {
        var newValue = e.value;
        if (newValue != null) {
            this.populateEmployeeOnApproverEntitySelectionChanged(newValue);
        }
    };
    /**
     * Populate employee on approver entity selection changed
     * @param id
     */
    ApproverGroupComponent.prototype.populateEmployeeOnApproverEntitySelectionChanged = function (id) {
        this.gridDataSource = this.makeAsyncDataSource(id, this.approverGroupService);
    };
    Object.defineProperty(ApproverGroupComponent.prototype, "gridBoxValue", {
        get: function () {
            return this.employeeIds;
        },
        set: function (value) {
            this.employeeIds = value || [];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * make data source
     * @param id
     * @param practitionerService
     */
    ApproverGroupComponent.prototype.makeAsyncDataSource = function (id, appGroupService) {
        var _this = this;
        return new custom_store_1.default({
            loadMode: "raw",
            key: "id",
            load: function () {
                return appGroupService.getEmployeeByApproverEntityType(id).toPromise().then(function (response) {
                    //set employee value
                    if (_this.approverGroupDataSource != undefined) {
                        _this.setEmployeeValue(_this.approverGroupDataSource.employeeIds);
                    }
                    return response;
                });
            }
        });
    };
    ;
    ApproverGroupComponent.prototype.ngOnInit = function () {
        this.init();
    };
    ApproverGroupComponent.prototype.ngAfterViewInit = function () {
        this.formValidation.instance.validate();
        //this.attachValidationToControl();
    };
    /**
     * attach validation to the controls
     *
     * */
    ApproverGroupComponent.prototype.attachValidationToControl = function () {
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
    ApproverGroupComponent.prototype.validationCallback = function (e) {
        return true;
    };
    ApproverGroupComponent.prototype.init = function () {
        var _this = this;
        this.approverGroupService.getApproverGroup(this.approverGroupId).subscribe(function (data) {
            _this.approverGroupDataSource = data.result.approverGroupModel,
                _this.approverGroupTypeSelectItems = data.result.approverGroupTypeSelectItems,
                _this.titlebar.initializeToolbar(_this.approverGroupId == 0 ? (_this.entityTitle + " : New") : _this.entityTitle + " : " + data.result.approverGroupModel.name, null, _this.toolbarType);
        });
    };
    /**
     * set employee value to combobox
     * @param employeeIds
     */
    ApproverGroupComponent.prototype.setEmployeeValue = function (employeeIds) {
        this.employeeIds = employeeIds;
    };
    ApproverGroupComponent.prototype.validateAndSave = function (action) {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    };
    ApproverGroupComponent.prototype.saveEntity = function (action) {
        var _this = this;
        this.approverGroupDataSource.employeeIds = this.employeeIds;
        if (this.approverGroupId == 0) {
            this.approverGroupService.createApproverGroup(this.approverGroupDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been saved successfully", 'Information');
                _this.approverGroupId = data.result;
                _this.redirectToListPage(action);
            });
        }
        else {
            this.approverGroupService.updateApproverGroup(this.approverGroupDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been updated successfully", 'Information');
                _this.approverGroupId = data.result;
                _this.redirectToListPage(action);
            });
        }
    };
    ApproverGroupComponent.prototype.redirectToListPage = function (action) {
        //debugger;
        var newNavigationUrl = '/system-settings/configuration/approver-group';
        var returnNavigationUrl = '/system-settings/configuration/approver-groups';
        if (action == utilities_1.DetailPageAction.Close || action == utilities_1.DetailPageAction.SaveAndClose) {
            this.navigationService.navigate(returnNavigationUrl);
        }
        else if (action == utilities_1.DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.approverGroupId, this.router.url);
        }
    };
    ApproverGroupComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    ApproverGroupComponent.prototype.onSaveNNewClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    ApproverGroupComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    ApproverGroupComponent.prototype.onCloseClicked = function (e) {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], ApproverGroupComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild('formValidation')
    ], ApproverGroupComponent.prototype, "formValidation", void 0);
    ApproverGroupComponent = __decorate([
        core_1.Component({
            selector: 'app-approver-group-form',
            templateUrl: './approver-group.form.component.html',
            styleUrls: ['./approver-group.form.component.scss'],
        })
    ], ApproverGroupComponent);
    return ApproverGroupComponent;
}());
exports.ApproverGroupComponent = ApproverGroupComponent;
//# sourceMappingURL=approver-group.form.component.js.map
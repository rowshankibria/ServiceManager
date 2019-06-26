"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var titlebar_component_1 = require("./../../../application-shared/components/titlebar/titlebar.component");
var utilities_1 = require("./../../../application-shared/components/titlebar/utilities");
var BranchComponent = /** @class */ (function () {
    function BranchComponent(branchService, messageService, navigationService, route, router) {
        var _this = this;
        this.branchService = branchService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.entityTitle = "Branch";
        this.branchId = 0;
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.branchDataSource = [];
        this.regionItemDataSource = [];
        this.contentClass = "detail-page-content-div";
        this.route.params.subscribe(function (params) {
            if (params['branchId'] !== undefined) {
                _this.branchId = params['branchId'];
                _this.toolbarType = utilities_1.ToolbarType.DetailPage;
                _this.contentClass = "detail-page-content-div";
            }
        });
    }
    BranchComponent.prototype.ngOnInit = function () {
        this.init();
    };
    BranchComponent.prototype.ngAfterViewInit = function () {
        this.formValidation.instance.validate();
        this.attachValidationToControl();
    };
    /**
     * attach validation to the controls
     *
     * */
    BranchComponent.prototype.attachValidationToControl = function () {
    };
    BranchComponent.prototype.validationCallback = function (e) {
        return true;
    };
    BranchComponent.prototype.init = function () {
        var _this = this;
        this.branchService.getBranch(this.branchId).subscribe(function (data) {
            _this.branchDataSource = data.result.branchModel,
                _this.regionItemDataSource = data.result.regionSelectItems,
                _this.titlebar.initializeToolbar(_this.branchId == 0 ? (_this.entityTitle + " : New") : _this.entityTitle + " : " + data.result.branchModel.branchName, null, _this.toolbarType);
        });
    };
    BranchComponent.prototype.validateAndSave = function (action) {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    };
    BranchComponent.prototype.saveEntity = function (action) {
        var _this = this;
        if (this.branchId == 0) {
            this.branchService.createBranch(this.branchDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been saved successfully", 'Information');
                _this.branchId = data.result;
                _this.redirectToListPage(action);
            });
        }
        else {
            this.branchService.updateBranch(this.branchDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been updated successfully", 'Information');
                _this.branchId = data.result;
                _this.redirectToListPage(action);
            });
        }
    };
    BranchComponent.prototype.redirectToListPage = function (action) {
        //debugger;
        var newNavigationUrl = '/crm/branch';
        if (action == utilities_1.DetailPageAction.Close || action == utilities_1.DetailPageAction.SaveAndClose) {
            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.branchId, this.router.url);
        }
    };
    BranchComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    BranchComponent.prototype.onSaveNNewClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    BranchComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    BranchComponent.prototype.onCloseClicked = function (e) {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], BranchComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild('formValidation')
    ], BranchComponent.prototype, "formValidation", void 0);
    BranchComponent = __decorate([
        core_1.Component({
            selector: 'app-branch-form',
            templateUrl: './branch-form.component.html',
            styleUrls: ['./branch-form.component.scss'],
        })
    ], BranchComponent);
    return BranchComponent;
}());
exports.BranchComponent = BranchComponent;
//# sourceMappingURL=brnach-form.component.js.map
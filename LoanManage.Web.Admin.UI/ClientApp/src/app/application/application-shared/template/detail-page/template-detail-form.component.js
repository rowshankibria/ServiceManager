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
var TemplateDetailFormComponent = /** @class */ (function () {
    function TemplateDetailFormComponent(detailFormService, messageService, navigationService, route, router) {
        var _this = this;
        this.detailFormService = detailFormService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.recordId = 0;
        this.paramKey = 'id'; //set param key
        this.formTitle = ''; // set form
        this.formDataSource = [];
        this.disabledDefaultCheckbox = false;
        this.isDefaultBusinessProfileUser = false;
        this.disabledInUpdateMode = true;
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.contentClass = "detail-page-content-div";
        this.route.params.subscribe(function (params) {
            if (params[_this.paramKey] !== undefined) {
                _this.recordId = params[_this.paramKey];
                _this.toolbarType = utilities_1.ToolbarType.DetailPage;
                //this.contentClass = "detail-page-content-div-tab";
            }
        });
    }
    TemplateDetailFormComponent.prototype.ngOnInit = function () {
        this.init();
    };
    TemplateDetailFormComponent.prototype.init = function () {
        var _this = this;
        this.detailFormService.getRecordInfoById(this.recordId).toPromise().then(function (response) {
            _this.formDataSource = response.result; //set property
            _this.disabledDefaultCheckbox = _this.formDataSource.isDefault;
            _this.isDefaultBusinessProfileUser = response.result.isDefaultBusinessProfile;
            _this.titlebar.initializeToolbar(_this.recordId == 0 ? _this.formTitle + ": New" : _this.formTitle + ": " + _this.formDataSource.name, null, _this.toolbarType);
        });
    };
    TemplateDetailFormComponent.prototype.ngAfterContentChecked = function () {
        this.disabledInUpdateMode = this.recordId > 0 && this.isDefaultBusinessProfileUser;
    };
    TemplateDetailFormComponent.prototype.saveEntity = function (action) {
        var _this = this;
        if (this.recordId == 0) {
            this.detailFormService.createRecord(this.formDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been saved successfully", 'Information');
                _this.recordId = data.result; //Set Record Id
                _this.formDataSource.id = _this.recordId;
                _this.redirectToListPage(action);
            });
        }
        else {
            this.detailFormService.updateRecord(this.recordId, this.formDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been updated successfully", 'Information');
                _this.redirectToListPage(action);
            });
        }
    };
    TemplateDetailFormComponent.prototype.redirectToListPage = function (action) {
        var newNavigationUrl = ''; //set newNavigationUrl
        if (action == utilities_1.DetailPageAction.Close || action == utilities_1.DetailPageAction.SaveAndClose) {
            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.recordId, this.router.url);
        }
        else {
            this.titlebar.setToolbarTitle(this.formTitle + ": " + this.formDataSource.displayName);
        }
    };
    /**
       * validate and save data
       */
    TemplateDetailFormComponent.prototype.validateAndSave = function (action) {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    };
    /**
     * on save button clicked
     */
    TemplateDetailFormComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    /**
     * on save and new button clicked
     */
    TemplateDetailFormComponent.prototype.onSaveNNewClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    /**
     * on save and close button clicked
     */
    TemplateDetailFormComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    /**
    * on close button clicked
    */
    TemplateDetailFormComponent.prototype.onCloseClicked = function (e) {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], TemplateDetailFormComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild('formValidation')
    ], TemplateDetailFormComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.Input()
    ], TemplateDetailFormComponent.prototype, "recordId", void 0);
    TemplateDetailFormComponent = __decorate([
        core_1.Component({
            selector: 'template-detail-form',
            templateUrl: './template-detail-form.component.html',
            styleUrls: ['./template-detail-form.component.scss']
        })
    ], TemplateDetailFormComponent);
    return TemplateDetailFormComponent;
}());
exports.TemplateDetailFormComponent = TemplateDetailFormComponent;
//# sourceMappingURL=template-detail-form.component.js.map
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
var CustomCategoryFormComponent = /** @class */ (function () {
    function CustomCategoryFormComponent(customCategoryservice, messageService, navigationService, route, router) {
        this.customCategoryservice = customCategoryservice;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.customCategory = {};
        this.customCategoryType = {};
        this.businessProfileSelectItems = [];
        this.mapTypeSelectItems = [];
        this.parentSelectItems = [];
        this.categoryId = 0;
        this.categoryTypeKey = "";
        this.entityName = "";
        this.showMapType = true;
        this.mapOption = null;
        this.entityType = 0;
        this.disabledDefaultCheckbox = false;
        this.enabledColor = false;
        this.enabledParent = true;
        this.mapTypeStyle = 'row form-group item-invisible';
        this.contentClass = "detail-page-content-div";
        this.categoryId = 0;
    }
    CustomCategoryFormComponent.prototype.ngAfterViewInit = function () {
    };
    CustomCategoryFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            if (params['routingKey'] !== undefined) {
                _this.categoryTypeKey = params['routingKey'];
            }
            if (params['id'] != undefined) {
                _this.categoryId = params['id'];
            }
        });
        this.init();
    };
    CustomCategoryFormComponent.prototype.init = function () {
        this.titlebar.initializeToolbar("", null, utilities_1.ToolbarType.DetailPage);
        this.setDatasource();
    };
    CustomCategoryFormComponent.prototype.setDatasource = function () {
        var _this = this;
        this.customCategoryservice.getCustomCategoryById(this.categoryId, this.categoryTypeKey, 0).subscribe(function (data) {
            _this.customCategoryType = data.result.customCategoryType;
            _this.customCategory = data.result.customCategory;
            _this.mapTypeSelectItems = data.result.mapTypeSelectItems;
            _this.disabledDefaultCheckbox = _this.customCategory.isDefault;
            if (_this.categoryId > 0) {
                _this.titlebar.setToolbarTitle(_this.customCategoryType.name + ": " + _this.customCategory.name);
            }
            else {
                _this.titlebar.setToolbarTitle(_this.customCategoryType.name + ": New");
            }
            _this.attachValidationToControl();
        });
    };
    CustomCategoryFormComponent.prototype.attachValidationToControl = function () {
        //validation   
        this.nameValidation.validationRules = [{ type: 'required', message: 'Name is required.' }];
        this.mapTypeOptionValidation.validationRules = [{ type: 'custom', validationCallback: this.validationCallback, message: '' }];
        if (this.customCategoryType.customCategoryMapTypeId > 0) {
            this.mapTypeStyle = 'row form-group item-visible';
            if (this.customCategoryType.isMapTypeRequired) {
                this.mapTypeOptionValidation.validationRules = [{ type: 'required', message: 'Map Type is required' }];
            }
        }
    };
    CustomCategoryFormComponent.prototype.validationCallback = function () {
        return true;
    };
    CustomCategoryFormComponent.prototype.saveEntity = function (action) {
        var _this = this;
        if (this.categoryId == 0 || this.categoryId == null) {
            this.customCategoryservice.createEntity(this.customCategory).subscribe(function (data) {
                _this.categoryId = data.result;
                _this.messageService.success("Record has been save successfully", 'Information');
                _this.redirectToListPage(action);
            });
        }
        else {
            this.customCategoryservice.updateEntity(this.categoryId, this.customCategory).subscribe(function (data) {
                _this.messageService.success("Record has been save successfully", 'Information');
                _this.redirectToListPage(action);
            });
        }
    };
    /**
     * validate and save data
     */
    CustomCategoryFormComponent.prototype.validateAndSave = function (action) {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    };
    /**
     * on save button clicked
     */
    CustomCategoryFormComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    /**
     * on save and new button clicked
     */
    CustomCategoryFormComponent.prototype.onSaveNNewClicked = function () {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    /**
     * on save and close button clicked
     */
    CustomCategoryFormComponent.prototype.onSaveNCloseClicked = function () {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    CustomCategoryFormComponent.prototype.onCloseClicked = function () {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    /**
    * redirect to list page
    */
    CustomCategoryFormComponent.prototype.redirectToListPage = function (action) {
        var newNavigationUrl = '/system-settings/type-and-category/' + this.categoryTypeKey;
        if (action == utilities_1.DetailPageAction.Close || action == utilities_1.DetailPageAction.SaveAndClose) {
            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.SaveAndNew) {
            if (newNavigationUrl + '/new' == this.router.url) {
                this.categoryId = 0;
                this.setDatasource();
            }
            else {
                this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/new', this.router.url);
            }
        }
        else if (action == utilities_1.DetailPageAction.Save && newNavigationUrl + '/new' == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.categoryId, this.router.url);
        }
    };
    CustomCategoryFormComponent.prototype.defaultValueChanged = function (e) {
        if (e.value) {
            this.customCategory.isActive = true;
        }
    };
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], CustomCategoryFormComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild('formValidation')
    ], CustomCategoryFormComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.ViewChild('nameValidation')
    ], CustomCategoryFormComponent.prototype, "nameValidation", void 0);
    __decorate([
        core_1.ViewChild('mapTypeOptionValidation')
    ], CustomCategoryFormComponent.prototype, "mapTypeOptionValidation", void 0);
    CustomCategoryFormComponent = __decorate([
        core_1.Component({
            selector: '.app-custom-category-form',
            templateUrl: './custom-category-form.component.html',
            styleUrls: ['./custom-category-form.component.scss'],
        })
    ], CustomCategoryFormComponent);
    return CustomCategoryFormComponent;
}());
exports.CustomCategoryFormComponent = CustomCategoryFormComponent;
//# sourceMappingURL=custom-category-form.component.js.map
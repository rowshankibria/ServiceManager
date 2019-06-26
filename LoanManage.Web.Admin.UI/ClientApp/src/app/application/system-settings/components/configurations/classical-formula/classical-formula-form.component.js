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
var ClassicalFormulaFormComponent = /** @class */ (function () {
    function ClassicalFormulaFormComponent(formulaService, messageService, navigationService, route, router) {
        var _this = this;
        this.formulaService = formulaService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.availableHerbDataSource = [];
        this.formulaHerbDataSource = [];
        this.tempDataSource = [];
        this.formula = [];
        this.formulaCategorySelectedItem = [];
        this.formulaSubCategorySelectedFilteredItem = [];
        this.formulaSubCategorySelectedItem = [];
        this.formulaId = 0;
        this.selectedRowsForAvailable = [];
        this.selectedRowsForFormula = [];
        this.formulaHerbList = [];
        this.formulaHerbModelList = [];
        this.contentClass = "detail-page-content-div";
        this.route.params.subscribe(function (params) {
            if (params['formulaId'] != undefined) {
                _this.formulaId = params['formulaId'];
            }
        });
        this.toolbarAdditionalItems = [];
    }
    /*
     * add additional menu item
     **/
    ClassicalFormulaFormComponent.prototype.addAdditionalToolbar = function () {
        ////expand menu
        //var expandItem = new ToolbarItem();
        //expandItem.location = 'after';
        //expandItem.widget = 'dxButton';
        //expandItem.locateInMenu = 'auto';
        //expandItem.visible = true;
        //expandItem.disabled = false;
        //var expandItemOption = new ToolbarItemOption();
        //expandItemOption.icon = 'chevrondown';
        //expandItemOption.text = 'Expand';
        //expandItemOption.onClick = () => {
        //    this.onExpandClicked();
        //};
        //expandItem.options = expandItemOption;
        //this.toolbarAdditionalItems.push(expandItem);
        ////collapse menu
        //var collapseItem = new ToolbarItem();
        //collapseItem.location = 'after';
        //collapseItem.widget = 'dxButton';
        //collapseItem.locateInMenu = 'auto';
        //collapseItem.visible = true;
        //collapseItem.disabled = false;
        //var collapseItemOption = new ToolbarItemOption();
        //collapseItemOption.icon = 'chevronup';
        //collapseItemOption.text = 'Collapse';
        //collapseItemOption.onClick = () => {
        //    this.onCollapseClicked();
        //};
        //collapseItem.options = collapseItemOption;
        //this.toolbarAdditionalItems.push(collapseItem);
    };
    ClassicalFormulaFormComponent.prototype.ngAfterViewInit = function () {
        this.attachValidationToControl();
    };
    ClassicalFormulaFormComponent.prototype.ngOnInit = function () {
        this.addAdditionalToolbar();
        this.init();
    };
    ClassicalFormulaFormComponent.prototype.init = function () {
        var _this = this;
        this.formulaService.getClassicalFormula(this.formulaId).subscribe(function (data) {
            _this.formula = data.result.formula,
                _this.formulaHerbList = data.result.formula.formulaHerbList,
                _this.formulaHerbModelList = data.result.formula.formulaHerbModelList,
                _this.formulaCategorySelectedItem = data.result.formulaCategorySelectedItem,
                _this.formulaSubCategorySelectedItem = data.result.formulaSubCategorySelectedItem,
                _this.titlebar.initializeToolbar(data.result.role == undefined ? "Classical Formula : New " : "Classical Formula : " + data.result.formula.name, _this.toolbarAdditionalItems, utilities_1.ToolbarType.DetailPage);
        });
        this.loadFormulaHerbDataSource();
        this.loadAvailableHerbDataSource();
    };
    /**
     * load formula herb data source
     * */
    ClassicalFormulaFormComponent.prototype.loadFormulaHerbDataSource = function () {
        var _this = this;
        if (this.formulaId !== undefined && this.formulaId !== null && this.formulaId != 0) {
            this.formulaHerbDataSource = new data_source_1.default({
                load: function (loadOptions) {
                    return _this.formulaService.getFormulaHerbByFormulaId(_this.formulaId, loadOptions).toPromise().then(function (response) {
                        return {
                            data: response.result.data,
                            totalCount: response.result.totalCount
                        };
                    });
                }
            });
        }
    };
    /**
     * load available herb data source
     *
     * */
    ClassicalFormulaFormComponent.prototype.loadAvailableHerbDataSource = function () {
        var _this = this;
        this.availableHerbDataSource = new data_source_1.default({
            load: function (loadOptions) {
                return _this.formulaService.getAvailableHerbByFormulaId(_this.formulaId, loadOptions).toPromise().then(function (response) {
                    return {
                        data: response.result.data,
                        totalCount: response.result.totalCount
                    };
                });
            }
        });
    };
    /**
     * on category value changed
     * @param e
     */
    ClassicalFormulaFormComponent.prototype.onCategoryValueChanged = function (e) {
        var value = e.value;
        if (value != undefined && value != null) {
            this.formulaSubCategorySelectedFilteredItem = this.formulaSubCategorySelectedItem.filter(function (x) { return x.tag == value; });
        }
    };
    /**
    * on value change for numeric control
    */
    ClassicalFormulaFormComponent.prototype.onNumericControlValueChanged = function (e, data) {
        //debugger;
        if (e.value === null) {
            e.component.option("value", 0);
        }
        if (e.value != null && e.value != undefined) {
            var model = new SelectClientModel();
            model.id = data.key.id;
            model.dose = e.value;
            this.formulaHerbModelList.push(model);
        }
    };
    /**
     * delete records
     **/
    ClassicalFormulaFormComponent.prototype.deleteRecord = function () {
        var _this = this;
        var data = this.tempDataSource;
        this.formulaService.deleteClassicalFormulaDetail(data.key.id).subscribe(function (data) {
            _this.messageService.success("Record has been save successfully", 'Information');
            _this.grdFormulaHerb.instance.refresh();
            _this.grdAvailableHerb.instance.refresh();
        });
    };
    /**
     * go to detail page udate record
     * @param data
     */
    ClassicalFormulaFormComponent.prototype.onDeleteClicked = function (data) {
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
     * attach validation to the controls
     *
     * */
    ClassicalFormulaFormComponent.prototype.attachValidationToControl = function () {
        //validation        
        this.formulaCategoryValidation.validationRules = [{ type: 'required', message: 'Root Category is required.' }];
        this.formulaSubCategoryValidation.validationRules = [{ type: 'required', message: 'Child Category is required.' }];
        this.classicalFormulaNameValidation.validationRules = [{ type: 'required', message: 'Name is required.' }];
    };
    /**
     * validate and save data
     */
    ClassicalFormulaFormComponent.prototype.validateAndSave = function (action) {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    };
    /**
     *
     * @param closedWindow
     * @param isNew
     */
    ClassicalFormulaFormComponent.prototype.saveEntity = function (action) {
        var _this = this;
        this.getSelectedAvailableHerb();
        if (this.formulaId !== undefined && this.formulaId !== null && this.formulaId != 0) {
            this.formulaService.updateClassicalFormula(this.formula).subscribe(function (data) {
                _this.messageService.success("Record has been update successfully", 'Information');
                _this.formulaId = data.result;
                _this.grdFormulaHerb.instance.refresh();
                _this.selectedRowsForAvailable = [];
                _this.grdAvailableHerb.instance.refresh();
                _this.redirectToListPage(action);
            });
        }
        else {
            this.formulaService.createClassicalFormula(this.formula).subscribe(function (data) {
                _this.messageService.success("Record has been save successfully", 'Information');
                _this.formulaId = data.result;
                _this.grdFormulaHerb.instance.refresh();
                _this.selectedRowsForAvailable = [];
                _this.grdAvailableHerb.instance.refresh();
                _this.redirectToListPage(action);
            });
        }
    };
    /**
    * get selected available herb
    */
    ClassicalFormulaFormComponent.prototype.getSelectedAvailableHerb = function () {
        //debugger;
        // iterate over each element in the array
        for (var i = 0; i < this.grdAvailableHerb.selectedRowKeys.length; i++) {
            //add to the targetted array
            this.formulaHerbList.push(this.grdAvailableHerb.selectedRowKeys[i].id);
        }
    };
    /**
    * on save button clicked
    */
    ClassicalFormulaFormComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    /**
     * on save and new button clicked
     */
    ClassicalFormulaFormComponent.prototype.onSaveNNewClicked = function () {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    /**
     * on save and close button clicked
     */
    ClassicalFormulaFormComponent.prototype.onSaveNCloseClicked = function () {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    /**
     * on close button clicked
     */
    ClassicalFormulaFormComponent.prototype.onCloseClicked = function () {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    /**
    * redirect to list page
    */
    ClassicalFormulaFormComponent.prototype.redirectToListPage = function (action) {
        var newNavigationUrl = '/system-settings/role';
        if (action == utilities_1.DetailPageAction.Close || action == utilities_1.DetailPageAction.SaveAndClose) {
            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.formulaId, this.router.url);
        }
        else {
            this.titlebar.setToolbarTitle("Role : " + this.formula.name);
        }
    };
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], ClassicalFormulaFormComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild('grdFormulaHerb')
    ], ClassicalFormulaFormComponent.prototype, "grdFormulaHerb", void 0);
    __decorate([
        core_1.ViewChild('grdAvailableHerb')
    ], ClassicalFormulaFormComponent.prototype, "grdAvailableHerb", void 0);
    __decorate([
        core_1.ViewChild('formValidation')
    ], ClassicalFormulaFormComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.ViewChild('formulaCategoryValidation')
    ], ClassicalFormulaFormComponent.prototype, "formulaCategoryValidation", void 0);
    __decorate([
        core_1.ViewChild('formulaSubCategoryValidation')
    ], ClassicalFormulaFormComponent.prototype, "formulaSubCategoryValidation", void 0);
    __decorate([
        core_1.ViewChild('classicalFormulaNameValidation')
    ], ClassicalFormulaFormComponent.prototype, "classicalFormulaNameValidation", void 0);
    ClassicalFormulaFormComponent = __decorate([
        core_1.Component({
            selector: 'app-classical-formula-form',
            templateUrl: './classical-formula-form.component.html',
            styleUrls: ['./classical-formula-form.component.scss']
        })
        /** role-form component*/
    ], ClassicalFormulaFormComponent);
    return ClassicalFormulaFormComponent;
}());
exports.ClassicalFormulaFormComponent = ClassicalFormulaFormComponent;
var SelectClientModel = /** @class */ (function () {
    function SelectClientModel() {
    }
    return SelectClientModel;
}());
exports.SelectClientModel = SelectClientModel;
//# sourceMappingURL=classical-formula-form.component.js.map
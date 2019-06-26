"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var data_source_1 = require("devextreme/data/data_source");
var titlebar_component_1 = require("./../../../application-shared/components/titlebar/titlebar.component");
var toolbar_item_1 = require("../../../application-shared/components/titlebar/toolbar-item");
var utilities_1 = require("./../../../application-shared/components/titlebar/utilities");
var CustomCategoriesComponent = /** @class */ (function () {
    function CustomCategoriesComponent(customCategoryService, route, router, messageService, navigationService) {
        var _this = this;
        this.customCategoryService = customCategoryService;
        this.route = route;
        this.router = router;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.dataSource = [];
        this.columns = [];
        this.currentFilter = {};
        this.gridHeight = 500;
        this.pageTitle = '';
        this.showMapType = true;
        this.returnUrl = '';
        this.editNavigationUrl = '';
        this.contentClass = "detail-page-content-div";
        this.toolbarAdditionalItems = [];
        this.route.params.subscribe(function (params) {
            if (params['routingKey'] !== undefined) {
                _this.categoryRoutingKey = params['routingKey'];
                _this.newNavigationUrl = 'system-settings/type-and-category/' + _this.categoryRoutingKey + '/new';
                _this.editNavigationUrl = 'system-settings/type-and-category/' + _this.categoryRoutingKey + '/';
                _this.closeNavigationUrl = '/';
            }
        });
    }
    CustomCategoriesComponent.prototype.onResize = function () {
        this.gridHeight = window.innerHeight - 110;
    };
    /**
     * ngOnInit event
     */
    CustomCategoriesComponent.prototype.ngOnInit = function () {
        this.gridHeight = window.innerHeight - 110;
        this.setGridDataSource();
        this.setPageInfo();
    };
    CustomCategoriesComponent.prototype.setPageInfo = function () {
        var _this = this;
        this.customCategoryService.getCustomCategoryTypeByKeyAsync(this.categoryRoutingKey).toPromise().then(function (response) {
            _this.pageTitle = response.result.name;
            _this.showMapType = response.result.customCategoryMapTypeId > 0;
            _this.columns = _this.getFields();
            _this.titlebar.setToolbarTitle(_this.pageTitle);
        });
    };
    CustomCategoriesComponent.prototype.getFields = function () {
        var a = [
            {
                "dataField": "name",
                "cellTemplate": "nameEditTemplate",
                "caption": "Name",
                "visible": true,
                "allowFiltering": true,
                "alignment": "left"
            },
            {
                "dataField": "code",
                "cellTemplate": "",
                "caption": "Code",
                "visible": true,
                "allowFiltering": true,
                "alignment": "left"
            },
            {
                "dataField": "desciption",
                "cellTemplate": "",
                "caption": "Desciption",
                "visible": true,
                "allowFiltering": true,
                "alignment": "left"
            },
            {
                "dataField": "mapTypeOptionName",
                "cellTemplate": "",
                "caption": "Map Type",
                "visible": this.showMapType,
                "allowFiltering": true,
                "alignment": "left"
            },
            {
                "dataField": "isDefault",
                "cellTemplate": "booleanCellTemplate",
                "caption": "Default",
                "visible": true,
                "allowFiltering": true,
                "alignment": "left"
            },
            {
                "dataField": "displayOrder",
                "cellTemplate": "",
                "caption": "Display Order",
                "visible": true,
                "allowFiltering": true,
                "alignment": "left",
                "sortOrder": "asc"
            },
            {
                "dataField": "isActive",
                "cellTemplate": "booleanCellTemplate",
                "caption": "Active",
                "visible": true,
                "allowFiltering": true,
                "alignment": "left",
                "dataType": "boolean"
            }
            //,
            //{
            //    "dataField": "createdByContactName",
            //    "cellTemplate": "",
            //    "caption": "Created By",
            //    "visible": true,
            //    "allowFiltering": true,
            //    "alignment": "left"
            //},
            //{
            //    "dataField": "createdDateTime",
            //    "cellTemplate": "",
            //    "caption": "Created On",
            //    "visible": true,
            //    "allowFiltering": true,
            //    "alignment": "left",
            //    "dataType": "date",
            //    "format": "dd/MM/yyyy hh:mm a"
            //}
        ];
        return a;
    };
    /*
    * Data source binding
    */
    CustomCategoriesComponent.prototype.setGridDataSource = function () {
        var _this = this;
        this.dataSource = new data_source_1.default({
            load: function (loadOptions) {
                return _this.customCategoryService.getDxGridCustomCategories(_this.categoryRoutingKey, loadOptions).toPromise().then(function (response) {
                    return {
                        data: response.result.data,
                        totalCount: response.result.totalCount
                    };
                });
            }
        });
    };
    /**
     * ngAfterViewInit event
     */
    CustomCategoriesComponent.prototype.ngAfterViewInit = function () {
        // Hide grid toolbar
        $('.dx-datagrid-header-panel .dx-toolbar-items-container').css("display", "none");
        this.titlebar.initializeToolbar(this.pageTitle, this.toolbarAdditionalItems, utilities_1.ToolbarType.ListPage);
    };
    /**
     * grid onToolbarPreparing event
     */
    CustomCategoriesComponent.prototype.onToolbarPreparing = function (e) {
        var _this = this;
        this.toolbarAdditionalItems = [];
        var toolbarItems = e.toolbarOptions.items;
        // Modifies an existing item
        toolbarItems.forEach(function (item) {
            if (item.name == "searchPanel") {
                _this.toolbarAdditionalItems.push(item);
            }
        });
        this.addToolbarAdditionalItems();
    };
    CustomCategoriesComponent.prototype.addToolbarAdditionalItems = function () {
        var _this = this;
        //Move Up
        var moveUpItem = new toolbar_item_1.ToolbarItem();
        moveUpItem.location = 'after';
        moveUpItem.widget = 'dxButton';
        moveUpItem.locateInMenu = 'auto';
        moveUpItem.visible = true;
        moveUpItem.disabled = false;
        var moveUpItemOption = new toolbar_item_1.ToolbarItemOption();
        moveUpItemOption.icon = 'chevronup';
        moveUpItemOption.text = 'Up';
        moveUpItemOption.onClick = function () {
            _this.onMoveUp();
        };
        moveUpItem.options = moveUpItemOption;
        this.toolbarAdditionalItems.push(moveUpItem);
        //Move Down
        var moveDownItem = new toolbar_item_1.ToolbarItem();
        moveDownItem.location = 'after';
        moveDownItem.widget = 'dxButton';
        moveDownItem.locateInMenu = 'auto';
        moveDownItem.visible = true;
        moveDownItem.disabled = false;
        var moveDownItemOption = new toolbar_item_1.ToolbarItemOption();
        moveDownItemOption.icon = 'chevrondown';
        moveDownItemOption.text = 'Down';
        moveDownItemOption.onClick = function () {
            _this.onMoveDown();
        };
        moveDownItem.options = moveDownItemOption;
        this.toolbarAdditionalItems.push(moveDownItem);
    };
    CustomCategoriesComponent.prototype.onMoveUp = function () {
        var _this = this;
        if (this.selectedRows != undefined && this.selectedRows.length > 0) {
            this.customCategoryService.moveUpCustomCategory(this.selectedRows[0]["id"]).toPromise().then(function (response) {
                if (response) {
                    _this.dataGrid.instance.getDataSource().reload();
                    _this.dataGrid.instance.clearSorting();
                    _this.dataGrid.instance.columnOption('displayOrder', {
                        sortOrder: 'asc',
                        sortIndex: 1
                    });
                }
            });
        }
    };
    CustomCategoriesComponent.prototype.onMoveDown = function () {
        var _this = this;
        if (this.selectedRows != undefined && this.selectedRows.length > 0) {
            this.customCategoryService.moveDownCustomCategory(this.selectedRows[0]["id"]).toPromise().then(function (response) {
                if (response) {
                    _this.dataGrid.instance.getDataSource().reload();
                    _this.dataGrid.instance.clearSorting();
                    _this.dataGrid.instance.columnOption('displayOrder', {
                        sortOrder: 'asc',
                        sortIndex: 1
                    });
                }
            });
        }
    };
    CustomCategoriesComponent.prototype.onContentReady = function (e) {
        console.log('onContentReadyAction');
        if (this.selectedRows != undefined && this.selectedRows.length > 0) {
            //e.component.selectRows([this.selectedRows[0]["id"]], true);
        }
    };
    /**
     * On new button clicked
     */
    CustomCategoriesComponent.prototype.onNewClicked = function () {
        //this.router.navigate([this.newNavigationUrl]);
        this.navigationService.navigateAndSetReturnUrl(this.newNavigationUrl, this.router.url);
    };
    /**
     * on delete button clicked
     */
    CustomCategoriesComponent.prototype.onDeleteClicked = function () {
        var _this = this;
        if (this.selectedRows == undefined || this.selectedRows.length == 0) {
            this.messageService.showInvalidSelectionMsg();
        }
        else {
            var result = this.messageService.showDeleteConfirmMsg(this.selectedRows.length);
            result.then(function (dialogResult) {
                if (dialogResult) {
                    _this.deleteRecord();
                }
            });
        }
    };
    /**
     * on close button clicked
     */
    CustomCategoriesComponent.prototype.onCloseClicked = function () {
        var returnUrl = "system-settings/types-and-categories";
        this.navigationService.navigate(returnUrl);
        //this.navigationService.navigateToReturnurl(this.router.url)
    };
    /**
     * on refresh button clicked
     */
    CustomCategoriesComponent.prototype.onRefreshClicked = function () {
        this.dataGrid.instance.clearFilter();
        this.dataGrid.instance.clearSelection();
        this.dataGrid.instance.clearSorting();
        this.dataGrid.instance.refresh();
        this.dataGrid.instance.columnOption('displayOrder', {
            sortOrder: 'asc',
            sortIndex: 1
        });
    };
    /**
     * delete records
     */
    CustomCategoriesComponent.prototype.deleteRecord = function () {
        var _this = this;
        if (this.selectedRows != undefined && this.selectedRows.length > 0) {
            //var recordIds: any[] = [];
            ////external toolbar
            //for (let item in this.selectedRows) {
            //    recordIds.push(this.selectedRows[item]["id"]);
            //}
            this.customCategoryService.deleteEntity(this.selectedRows[0]["id"]).subscribe(function (data) {
                _this.messageService.showDataDeletedMsg();
                _this.selectedRows = [];
                _this.dataGrid.instance.getDataSource().reload();
            });
        }
    };
    /**
     * go to detail page udate record
     * @param data
     */
    CustomCategoriesComponent.prototype.updateRecords = function (data) {
        //this.router.navigate([this.editNavigationUrl + data.key.id]);
        this.navigationService.navigateAndSetReturnUrl(this.editNavigationUrl + data.key.id, this.router.url);
    };
    CustomCategoriesComponent.prototype.onEditorPreparing = function (e) {
        if (e.parentType == 'filterRow' && e.dataType == "boolean" && e.editorName == "dxSelectBox") {
            e.trueText = "Yes";
            e.falseText = "No";
        }
        else if (e.parentType == 'filterRow' && e.dataType == "date" && e.editorName == "dxDateBox") {
            e.editorOptions.displayFormat = "dd/MM/yyyy";
        }
        //if (e.parentType == "filterRow") {
        //    e.editorOptions.inputAttr = { 'autocomplete': "off" }
        //}
    };
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], CustomCategoriesComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild('grdCompany')
    ], CustomCategoriesComponent.prototype, "dataGrid", void 0);
    __decorate([
        core_1.HostListener('window:resize')
    ], CustomCategoriesComponent.prototype, "onResize", null);
    CustomCategoriesComponent = __decorate([
        core_1.Component({
            selector: 'app-dx-data-grid-test',
            templateUrl: './custom-categories.component.html',
            styleUrls: ['./custom-categories.component.scss'],
        })
    ], CustomCategoriesComponent);
    return CustomCategoriesComponent;
}());
exports.CustomCategoriesComponent = CustomCategoriesComponent;
//# sourceMappingURL=custom-categories.component.js.map
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
var utilities_1 = require("./../../../application-shared/components/titlebar/utilities");
var ListComponent = /** @class */ (function () {
    function ListComponent(listservice, route, router, messageService, navigationService) {
        this.listservice = listservice;
        this.route = route;
        this.router = router;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.dataSource = [];
        this.columns = [];
        this.currentFilter = {};
        this.gridHeight = 500;
        this.contentClass = "list-page-content-div";
        this.toolbarType = utilities_1.ToolbarType.ListPage;
        this.listTabGridHeightToReduce = 140;
        this.listGridHeightToReduce = 95;
        this.onContextMenuPreparing = new core_1.EventEmitter();
        this.onGridNewButtonClick = new core_1.EventEmitter();
        this.onGridEditLinkClick = new core_1.EventEmitter();
        this.openInSameContainer = false;
        this.pageRoutingUrl = '';
        this.toolbarAdditionalItems = [];
        this.pageRoutingUrl = this.router.url;
    }
    ListComponent.prototype.onResize = function () {
        if (this.toolbarType == utilities_1.ToolbarType.ListTabPage)
            this.gridHeight = window.innerHeight - this.listTabGridHeightToReduce;
        else
            this.gridHeight = window.innerHeight - this.listGridHeightToReduce;
    };
    /**
     * ngOnInit event
     */
    ListComponent.prototype.ngOnInit = function () {
        //if (this.pageComponentKey == null || this.pageComponentKey == undefined) {
        //    this.routingUrl = this.router.url;
        //}
        this.getListPageInfo();
    };
    /*
    * set page information
    */
    ListComponent.prototype.getListPageInfo = function () {
        var _this = this;
        if (this.pageComponentKey != null && this.pageComponentKey != undefined) {
            this.listservice.getPageInfoByName(this.pageComponentKey)
                .subscribe(function (data) {
                _this.setPageProperty(data);
                _this.listTitlebar.initializeToolbar(_this.listPage.title, _this.toolbarAdditionalItems, utilities_1.ToolbarType.ListTabPage);
                _this.contentClass = "list-page-content-div-tab";
                _this.toolbarType = utilities_1.ToolbarType.ListTabPage;
                _this.gridHeight = window.innerHeight - _this.listTabGridHeightToReduce;
            });
        }
        else {
            this.listservice.getPageInfoByRoutingUrl(this.pageRoutingUrl)
                .subscribe(function (data) {
                _this.setPageProperty(data);
                _this.listTitlebar.initializeToolbar(_this.listPage.title, _this.toolbarAdditionalItems, utilities_1.ToolbarType.ListPage);
                _this.toolbarType = utilities_1.ToolbarType.ListPage;
                _this.gridHeight = window.innerHeight - _this.listGridHeightToReduce;
            });
        }
    };
    ListComponent.prototype.setPageProperty = function (data) {
        this.listPage = data.result;
        this.columns = this.listPage.fields;
        this.setServiceUrl();
        this.setGridDataSource();
        this.setNavigationUrl();
    };
    /**
     * Set Service url
     * @param serviceName
     */
    ListComponent.prototype.setServiceUrl = function () {
        this.getServiceUrl = this.listPage.pageServiceUrls.find(function (c) { return c.serviceName === 'GetServiceUrl'; }).serviceUrl;
        if (!this.getServiceUrl) {
            this.messageService.showInvalidServiceUrlMsg('GetServiceUrl');
        }
        if (this.uniqueEntityId != '' && this.uniqueEntityId != null && this.uniqueEntityId != undefined) {
            this.getServiceUrl = this.getServiceUrl + this.uniqueEntityId;
            if (this.entityId > 0)
                this.getServiceUrl = this.getServiceUrl + '/';
        }
        if (this.entityId > 0) {
            this.getServiceUrl = this.getServiceUrl + this.entityId;
        }
        this.deleteServiceUrl = this.listPage.pageServiceUrls.find(function (c) { return c.serviceName === 'DeleteServiceUrl'; }).serviceUrl;
        if (!this.deleteServiceUrl) {
            this.messageService.showInvalidServiceUrlMsg('DeleteServiceUrl');
        }
    };
    /**
    * Set Navigation url
    * @param serviceName
    */
    ListComponent.prototype.setNavigationUrl = function () {
        if (!this.newNavigationUrl) {
            this.newNavigationUrl = this.listPage.pageNavigationUrls.find(function (c) { return c.linkName === 'New'; }).navigateUrl;
            if (!this.newNavigationUrl) {
                this.messageService.showInvalidNavigationUrlMsg('Invalid Configuration');
            }
        }
        if (!this.editNavigationUrl) {
            this.editNavigationUrl = this.listPage.pageNavigationUrls.find(function (c) { return c.linkName === 'Edit'; }).navigateUrl;
            if (!this.editNavigationUrl) {
                this.messageService.showInvalidNavigationUrlMsg('Invalid Configuration');
            }
        }
        if (!this.closeNavigationUrl) {
            this.closeNavigationUrl = this.listPage.pageNavigationUrls.find(function (c) { return c.linkName === 'Close'; }).navigateUrl;
            if (!this.closeNavigationUrl) {
                this.messageService.showInvalidNavigationUrlMsg('Invalid Configuration');
            }
        }
        if (this.uniqueEntityId != '' && this.uniqueEntityId != null && this.uniqueEntityId != undefined) {
            this.newNavigationUrl = this.newNavigationUrl + this.uniqueEntityId;
            this.editNavigationUrl = this.editNavigationUrl + this.uniqueEntityId + '/';
        }
        else if (this.entityId > 0) {
            this.newNavigationUrl = this.newNavigationUrl + this.entityId;
            this.editNavigationUrl = this.editNavigationUrl + this.entityId + '/';
        }
    };
    /*
    * Data source binding
    */
    ListComponent.prototype.setGridDataSource = function () {
        var _this = this;
        this.dataSource = new data_source_1.default({
            load: function (loadOptions) {
                return _this.listservice.getDxGridRecords(_this.getServiceUrl, loadOptions).toPromise().then(function (response) {
                    return {
                        data: response.result.data,
                        totalCount: response.result.totalCount
                    };
                });
            }
        });
    };
    ListComponent.prototype.ngAfterContentChecked = function () {
        $('.dx-datagrid-header-panel .dx-toolbar-items-container').css("display", "none");
        $('.dx-datagrid-filter-row .dx-editor-cell .dx-texteditor-input').attr("placeholder", "Search...");
    };
    /**
     * grid onToolbarPreparing event
     */
    ListComponent.prototype.onToolbarPreparing = function (e) {
        var _this = this;
        this.toolbarAdditionalItems = [];
        var toolbarItems = e.toolbarOptions.items;
        // Modifies an existing item
        toolbarItems.forEach(function (item) {
            if (item.name == "searchPanel") {
                _this.toolbarAdditionalItems.push(item);
            }
        });
    };
    ListComponent.prototype.onGridContextMenuPreparing = function (e) {
        this.onContextMenuPreparing.emit(e);
    };
    /**
     * On new button clicked
     */
    ListComponent.prototype.onNewClicked = function () {
        if (this.openInSameContainer) {
            this.onGridNewButtonClick.emit();
        }
        else {
            this.navigationService.navigateAndSetReturnUrl(this.newNavigationUrl, this.router.url);
        }
    };
    /**
     * on delete button clicked
     */
    ListComponent.prototype.onDeleteClicked = function () {
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
    ListComponent.prototype.onCloseClicked = function () {
        if (this.returnUrl != '' && this.returnUrl != null && this.returnUrl != undefined) {
            this.navigationService.navigate(this.returnUrl);
        }
        else {
            this.navigationService.navigateToReturnurl(this.router.url);
        }
    };
    /**
     * on refresh button clicked
     */
    ListComponent.prototype.onRefreshClicked = function () {
        this.dataGrid.instance.clearFilter();
        this.dataGrid.instance.clearSelection();
        this.dataGrid.instance.clearSorting();
        this.dataGrid.instance.refresh();
    };
    /**
     * delete records
     */
    ListComponent.prototype.deleteRecord = function () {
        var _this = this;
        if (this.selectedRows != undefined && this.selectedRows.length > 0) {
            var recordIds = [];
            //external toolbar
            for (var item in this.selectedRows) {
                recordIds.push(this.selectedRows[item]["id"]);
            }
            if (recordIds.length > 1) {
                this.listservice.deleteRecords(this.deleteServiceUrl, recordIds).subscribe(function (data) {
                    _this.messageService.showDataDeletedMsg();
                    _this.selectedRows = [];
                    _this.dataGrid.instance.getDataSource().reload();
                });
            }
            else {
                this.listservice.deleteRecord(this.deleteServiceUrl, recordIds[0]).subscribe(function (data) {
                    _this.messageService.showDataDeletedMsg();
                    _this.selectedRows = [];
                    _this.dataGrid.instance.getDataSource().reload();
                });
            }
        }
    };
    /**
     * go to detail page udate record
     * @param data
     */
    ListComponent.prototype.onNameEditTemplateLinkClick = function (data) {
        if (this.openInSameContainer) {
            this.onGridEditLinkClick.emit(data.key);
        }
        else {
            this.navigationService.navigateToNewTab(this.editNavigationUrl + data.key.id);
        }
    };
    ListComponent.prototype.onNameEditTemplateEditIconClick = function (data) {
        this.navigationService.navigateAndSetReturnUrl(this.editNavigationUrl + data.key.id, this.router.url);
    };
    ListComponent.prototype.onEditorPreparing = function (e) {
        if (e.parentType == 'filterRow' && e.dataType == "boolean" && e.editorName == "dxSelectBox") {
            e.trueText = "Yes";
            e.falseText = "No";
        }
        //if (e.parentType == "filterRow") {
        //    //e.editorOptions.inputAttr = { 'autocomplete': "off" }
        //    e.editorOptions.inputAttr = { 'placeholder' : 'search...' }
        //}
    };
    __decorate([
        core_1.Output()
    ], ListComponent.prototype, "onContextMenuPreparing", void 0);
    __decorate([
        core_1.Output()
    ], ListComponent.prototype, "onGridNewButtonClick", void 0);
    __decorate([
        core_1.Output()
    ], ListComponent.prototype, "onGridEditLinkClick", void 0);
    __decorate([
        core_1.Input('PageComponentKey')
    ], ListComponent.prototype, "pageComponentKey", void 0);
    __decorate([
        core_1.Input('UniqueEntityId')
    ], ListComponent.prototype, "uniqueEntityId", void 0);
    __decorate([
        core_1.Input('EntityId')
    ], ListComponent.prototype, "entityId", void 0);
    __decorate([
        core_1.Input('ReturnUrl')
    ], ListComponent.prototype, "returnUrl", void 0);
    __decorate([
        core_1.Input('OpenInSameContainer')
    ], ListComponent.prototype, "openInSameContainer", void 0);
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], ListComponent.prototype, "listTitlebar", void 0);
    __decorate([
        core_1.ViewChild('grdCompany')
    ], ListComponent.prototype, "dataGrid", void 0);
    __decorate([
        core_1.HostListener('window:resize')
    ], ListComponent.prototype, "onResize", null);
    ListComponent = __decorate([
        core_1.Component({
            selector: 'app-dx-data-grid',
            templateUrl: './list.component.html',
            styleUrls: ['./list.component.scss'],
        })
    ], ListComponent);
    return ListComponent;
}());
exports.ListComponent = ListComponent;
//# sourceMappingURL=list.component.js.map
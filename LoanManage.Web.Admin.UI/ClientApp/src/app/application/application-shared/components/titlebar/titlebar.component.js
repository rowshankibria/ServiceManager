"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var toolbar_item_1 = require("./toolbar-item");
var utilities_1 = require("./utilities");
var TitlebarComponent = /** @class */ (function () {
    //constructor
    function TitlebarComponent() {
        //declare enum variable
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.hideDefaulMenu = false;
        this.title = '';
        this.hideSaveAndNew = false;
        this.hideSaveAndClose = false;
        this.hideSave = false;
        this.isinitialize = false;
        this.toolbarWidth = 1000;
        this.toolbarClass = 'toolbar-outer-area';
        //toolbar item for detail page
        this.save = new core_1.EventEmitter();
        this.saveClose = new core_1.EventEmitter();
        this.saveNew = new core_1.EventEmitter();
        //toolbar item for list page
        this.new = new core_1.EventEmitter();
        this.delete = new core_1.EventEmitter();
        this.refresh = new core_1.EventEmitter();
        //common toolbar item
        this.close = new core_1.EventEmitter();
        this.toolbaritems = [];
    }
    //button clicked event
    //onClick(): void {
    //    this.save.emit('');
    //    this.saveClose.emit();
    //    this.saveNew.emit();
    //    this.close.emit();
    //    this.new.emit();
    //    this.delete.emit();
    //    this.refresh.emit();
    //}
    /**
     * @HostListener resize event
     */
    TitlebarComponent.prototype.onResize = function () {
        this.setToolbarSize();
    };
    /**
     * ngAfterViewInit Events
     */
    TitlebarComponent.prototype.ngAfterViewInit = function () {
        this.setToolbarSize();
    };
    Object.defineProperty(TitlebarComponent.prototype, "toolbarItems", {
        //get toolbar item object
        get: function () {
            return this.toolbaritems;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * set toolbar width dynamically
     */
    TitlebarComponent.prototype.setToolbarSize = function () {
        //if it is not tab page
        if ((this.toolbarType == utilities_1.ToolbarType.DetailPage) || (this.toolbarType == utilities_1.ToolbarType.ListPage)) {
            var dom = document.getElementById('div-outer');
            var windowInrWidth = window.innerWidth;
            var toolbarWidth = windowInrWidth;
            //if window width 
            if (windowInrWidth > 992) {
                dom.style.left = '200px';
            }
            else {
                dom.style.left = '0px';
            }
        }
    };
    //add detail page toolbar
    TitlebarComponent.prototype.addDetailPageToolbarItem = function (externalItem) {
        var _this = this;
        //external toolbar
        for (var item in externalItem) {
            this.toolbaritems.push(externalItem[item]);
        }
        //entity caption
        var titleItem = new toolbar_item_1.ToolbarItem();
        titleItem.location = 'before';
        titleItem.locateInMenu = 'never';
        titleItem.visible = true;
        titleItem.disabled = false;
        titleItem.template = function () {
            return '<div id=\'tb-title-lbl-id\' style=\'font-size:16px; color:#ffffff;\' class=\'toolbar-label\'>' + _this.title + '</div>';
        };
        this.toolbaritems.push(titleItem);
        if (!this.hideDefaulMenu) {
            //save menu
            var saveItem = new toolbar_item_1.ToolbarItem();
            saveItem.location = 'after';
            saveItem.widget = 'dxButton';
            saveItem.locateInMenu = 'auto';
            saveItem.visible = !this.hideSave;
            saveItem.disabled = false;
            var saveItemOption = new toolbar_item_1.ToolbarItemOption();
            saveItemOption.icon = 'save';
            saveItemOption.text = 'Save';
            saveItemOption.onClick = function () {
                _this.save.emit();
            };
            saveItem.options = saveItemOption;
            this.toolbaritems.push(saveItem);
            //save and new menu
            var saveNnewItem = new toolbar_item_1.ToolbarItem();
            saveNnewItem.location = 'after';
            saveNnewItem.widget = 'dxButton';
            saveNnewItem.locateInMenu = 'auto';
            saveNnewItem.visible = false; //!this.hideSaveAndNew;
            saveNnewItem.disabled = false;
            var saveNnewItemOption = new toolbar_item_1.ToolbarItemOption();
            saveNnewItemOption.icon = 'save';
            saveNnewItemOption.text = 'Save & New';
            saveNnewItemOption.onClick = function () {
                _this.saveNew.emit();
            };
            saveNnewItem.options = saveNnewItemOption;
            this.toolbaritems.push(saveNnewItem);
            //save and close menu
            var saveNcloseItem = new toolbar_item_1.ToolbarItem();
            saveNcloseItem.location = 'after';
            saveNcloseItem.widget = 'dxButton';
            saveNcloseItem.locateInMenu = 'auto';
            saveNcloseItem.visible = !this.hideSaveAndClose;
            saveNcloseItem.disabled = false;
            var saveNcloseItemOption = new toolbar_item_1.ToolbarItemOption();
            saveNcloseItemOption.icon = 'save';
            saveNcloseItemOption.text = 'Save & Close';
            saveNcloseItemOption.onClick = function () {
                _this.saveClose.emit();
            };
            saveNcloseItem.options = saveNcloseItemOption;
            this.toolbaritems.push(saveNcloseItem);
        }
        //close menu
        var closeItem = new toolbar_item_1.ToolbarItem();
        closeItem.location = 'after';
        closeItem.widget = 'dxButton';
        closeItem.locateInMenu = 'auto';
        closeItem.visible = true;
        closeItem.disabled = false;
        var closeItemOption = new toolbar_item_1.ToolbarItemOption();
        closeItemOption.icon = 'clear';
        closeItemOption.text = 'Close';
        closeItemOption.onClick = function () {
            _this.close.emit();
        };
        closeItem.options = closeItemOption;
        this.toolbaritems.push(closeItem);
    };
    //add list page toolbar
    TitlebarComponent.prototype.addListPageToolbarItem = function (externalItem) {
        var _this = this;
        //external toolbar
        for (var item in externalItem) {
            this.toolbaritems.push(externalItem[item]);
        }
        //entity caption
        var titleItem = new toolbar_item_1.ToolbarItem();
        titleItem.id = 1;
        titleItem.location = 'before';
        titleItem.locateInMenu = 'never';
        titleItem.visible = true;
        titleItem.disabled = false;
        titleItem.template = function () {
            return '<div  id=\'tb-title-lbl-id\' style=\'font-size:16px; color:#ffffff;\' class=\'toolbar-label\'>' + _this.title + '</div>';
        };
        this.toolbaritems.push(titleItem);
        //new menu
        var newItem = new toolbar_item_1.ToolbarItem();
        newItem.id = 2;
        newItem.location = 'after';
        newItem.widget = 'dxButton';
        newItem.locateInMenu = 'auto';
        newItem.visible = true;
        newItem.disabled = false;
        var newItemOption = new toolbar_item_1.ToolbarItemOption();
        newItemOption.icon = 'add';
        newItemOption.text = 'New';
        newItemOption.onClick = function () {
            _this.new.emit();
        };
        newItem.options = newItemOption;
        this.toolbaritems.push(newItem);
        //delete menu
        var deleteItem = new toolbar_item_1.ToolbarItem();
        deleteItem.id = 3;
        deleteItem.location = 'after';
        deleteItem.widget = 'dxButton';
        deleteItem.locateInMenu = 'auto';
        deleteItem.visible = true;
        deleteItem.disabled = false;
        var deleteItemOption = new toolbar_item_1.ToolbarItemOption();
        deleteItemOption.icon = 'trash';
        deleteItemOption.text = 'Delete';
        deleteItemOption.onClick = function () {
            _this.delete.emit();
        };
        deleteItem.options = deleteItemOption;
        this.toolbaritems.push(deleteItem);
        //refresh menu
        var refreshItem = new toolbar_item_1.ToolbarItem();
        refreshItem.id = 4;
        refreshItem.location = 'after';
        refreshItem.widget = 'dxButton';
        refreshItem.locateInMenu = 'auto';
        refreshItem.visible = true;
        refreshItem.disabled = false;
        var refreshItemOption = new toolbar_item_1.ToolbarItemOption();
        refreshItemOption.icon = 'refresh';
        refreshItemOption.text = 'Refresh';
        refreshItemOption.onClick = function () {
            _this.refresh.emit();
        };
        refreshItem.options = refreshItemOption;
        this.toolbaritems.push(refreshItem);
        //close menu
        var closeItem = new toolbar_item_1.ToolbarItem();
        closeItem.id = 5;
        closeItem.location = 'after';
        closeItem.widget = 'dxButton';
        closeItem.locateInMenu = 'auto';
        closeItem.visible = true;
        closeItem.disabled = false;
        var closeItemOption = new toolbar_item_1.ToolbarItemOption();
        closeItemOption.icon = 'clear';
        closeItemOption.text = 'Close';
        closeItemOption.onClick = function () {
            _this.close.emit();
        };
        closeItem.options = closeItemOption;
        this.toolbaritems.push(closeItem);
    };
    //add link page toolbar
    TitlebarComponent.prototype.addLinkPageToolbarItem = function () {
        var _this = this;
        //entity caption
        var titleItem = new toolbar_item_1.ToolbarItem();
        titleItem.id = 1;
        titleItem.location = 'before';
        titleItem.locateInMenu = 'never';
        titleItem.visible = true;
        titleItem.disabled = false;
        titleItem.template = function () {
            return '<div id=\'tb-title-lbl-id\' style=\'font-size:16px; color:#ffffff;\' class=\'toolbar-label\'>' + _this.title + '</div>';
        };
        this.toolbaritems.push(titleItem);
        //close menu
        var closeItem = new toolbar_item_1.ToolbarItem();
        closeItem.id = 5;
        closeItem.location = 'after';
        closeItem.widget = 'dxButton';
        closeItem.locateInMenu = 'auto';
        closeItem.visible = true;
        closeItem.disabled = false;
        var closeItemOption = new toolbar_item_1.ToolbarItemOption();
        closeItemOption.icon = 'clear';
        closeItemOption.text = 'Close';
        closeItemOption.onClick = function () {
            _this.close.emit();
        };
        closeItem.options = closeItemOption;
        this.toolbaritems.push(closeItem);
    };
    //initialize toolbar. This will be initialized from parent component
    TitlebarComponent.prototype.initializeToolbar = function (title, item, toolbarType, hideDefaultMenu) {
        if (hideDefaultMenu === void 0) { hideDefaultMenu = false; }
        if (this.isinitialize)
            return;
        this.isinitialize = true;
        this.hideDefaulMenu = hideDefaultMenu;
        //this.toolbaritems = [];
        //debugger;
        this.toolbarType = toolbarType;
        if (title != undefined)
            this.title = title;
        //this.toolbaritems = [];
        //choose toobar type
        switch (toolbarType) {
            case utilities_1.ToolbarType.ListPage: {
                this.addListPageToolbarItem(item);
                break;
            }
            case utilities_1.ToolbarType.ListTabPage: {
                this.toolbarClass = 'toolbar-outer-area-tab-page';
                this.addListPageToolbarItem(item);
                break;
            }
            case utilities_1.ToolbarType.DetailPage: {
                this.addDetailPageToolbarItem(item);
                break;
            }
            case utilities_1.ToolbarType.DetailTabPage: {
                this.toolbarClass = 'toolbar-outer-area-tab-page';
                this.addDetailPageToolbarItem(item);
                break;
            }
            case utilities_1.ToolbarType.LinkPage: {
                this.addLinkPageToolbarItem();
                break;
            }
            case utilities_1.ToolbarType.TabPage: {
                break;
            }
            default:
                break;
        }
    };
    TitlebarComponent.prototype.setToolbarTitle = function (title) {
        this.title = title;
        $('#tb-title-lbl-id').text(title);
    };
    __decorate([
        core_1.Input()
    ], TitlebarComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input('HideSaveAndNew')
    ], TitlebarComponent.prototype, "hideSaveAndNew", void 0);
    __decorate([
        core_1.Input('HideSaveAndClose')
    ], TitlebarComponent.prototype, "hideSaveAndClose", void 0);
    __decorate([
        core_1.Input('HideSave')
    ], TitlebarComponent.prototype, "hideSave", void 0);
    __decorate([
        core_1.Output()
    ], TitlebarComponent.prototype, "save", void 0);
    __decorate([
        core_1.Output()
    ], TitlebarComponent.prototype, "saveClose", void 0);
    __decorate([
        core_1.Output()
    ], TitlebarComponent.prototype, "saveNew", void 0);
    __decorate([
        core_1.Output()
    ], TitlebarComponent.prototype, "new", void 0);
    __decorate([
        core_1.Output()
    ], TitlebarComponent.prototype, "delete", void 0);
    __decorate([
        core_1.Output()
    ], TitlebarComponent.prototype, "refresh", void 0);
    __decorate([
        core_1.Output()
    ], TitlebarComponent.prototype, "close", void 0);
    __decorate([
        core_1.HostListener('window:resize')
    ], TitlebarComponent.prototype, "onResize", null);
    TitlebarComponent = __decorate([
        core_1.Component({
            selector: 'app-titlebar',
            templateUrl: './titlebar.component.html',
            styleUrls: ['./titlebar.component.scss']
        })
    ], TitlebarComponent);
    return TitlebarComponent;
}());
exports.TitlebarComponent = TitlebarComponent;
//# sourceMappingURL=titlebar.component.js.map
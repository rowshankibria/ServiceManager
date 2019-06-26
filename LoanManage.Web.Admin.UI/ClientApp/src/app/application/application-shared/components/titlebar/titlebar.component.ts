import { Component, OnInit, Output, EventEmitter, Input, forwardRef, AfterViewInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DxButtonModule, } from 'devextreme-angular';
import { ToolbarItem, ToolbarItemOption } from './toolbar-item';
import { ToolbarType } from './utilities';
import { debounce } from 'rxjs/operator/debounce';
import { startWith } from 'rxjs-compat/operator/startWith';
declare var $: any;

@Component({
    selector: 'app-titlebar',
    templateUrl: './titlebar.component.html',
    styleUrls: ['./titlebar.component.scss']
})

export class TitlebarComponent implements AfterViewInit {

    //declare enum variable
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    hideDefaulMenu: boolean = false;

    //variables
    toolbaritems: any[];
    @Input() title: string = '';
    @Input('HideSaveAndNew') hideSaveAndNew: boolean = false;
    @Input('HideSaveAndClose') hideSaveAndClose: boolean = false;
    @Input('HideSave') hideSave: boolean = false;

    isinitialize: boolean = false;
    toolbarWidth: number = 1000;
    toolbarClass: string = 'toolbar-outer-area';

    //toolbar item for detail page
    @Output() save: EventEmitter<any> = new EventEmitter<any>();
    @Output() saveClose: EventEmitter<void> = new EventEmitter<void>();
    @Output() saveNew: EventEmitter<void> = new EventEmitter<void>();
    //toolbar item for list page
    @Output() new: EventEmitter<void> = new EventEmitter<void>();
    @Output() delete: EventEmitter<void> = new EventEmitter<void>();
    @Output() refresh: EventEmitter<void> = new EventEmitter<void>();

    //common toolbar item
    @Output() close: EventEmitter<void> = new EventEmitter<void>();

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
    @HostListener('window:resize') onResize() {
        this.setToolbarSize();
    }

    /**
     * ngAfterViewInit Events
     */
    ngAfterViewInit(): void {
        this.setToolbarSize();
    }

    //constructor
    constructor() {

        this.toolbaritems = [];
    }

    //get toolbar item object
    get toolbarItems() {
        return this.toolbaritems;
    }

    /**
     * set toolbar width dynamically
     */
    setToolbarSize(): void {

        //if it is not tab page
        if ((this.toolbarType == ToolbarType.DetailPage) || (this.toolbarType == ToolbarType.ListPage)) {
            var dom = document.getElementById('div-outer')
            let windowInrWidth = window.innerWidth;
            let toolbarWidth = windowInrWidth;
            //if window width 
            if (windowInrWidth > 992) {
                dom.style.left = '200px';
            }
            else {
                dom.style.left = '0px';
            }
        }
    }

    //add detail page toolbar
    addDetailPageToolbarItem(externalItem): void {

        //external toolbar
        for (let item in externalItem) {
            this.toolbaritems.push(externalItem[item]);
        }

        //entity caption
        var titleItem = new ToolbarItem();
        titleItem.location = 'before';
        titleItem.locateInMenu = 'never';
        titleItem.visible = true;
        titleItem.disabled = false;
        titleItem.template = () => {
            return '<div id=\'tb-title-lbl-id\' style=\'font-size:16px; color:#ffffff;\' class=\'toolbar-label\'>' + this.title + '</div>';
        };
        this.toolbaritems.push(titleItem);

        if (!this.hideDefaulMenu) {

            //save menu
            var saveItem = new ToolbarItem();
            saveItem.location = 'after';
            saveItem.widget = 'dxButton';
            saveItem.locateInMenu = 'auto';
            saveItem.visible = !this.hideSave;
            saveItem.disabled = false;

            var saveItemOption = new ToolbarItemOption();
            saveItemOption.icon = 'save';
            saveItemOption.text = 'Save';

            saveItemOption.onClick = () => {
                this.save.emit();
            };
            saveItem.options = saveItemOption;
            this.toolbaritems.push(saveItem);


            //save and new menu
            var saveNnewItem = new ToolbarItem();
            saveNnewItem.location = 'after';
            saveNnewItem.widget = 'dxButton';
            saveNnewItem.locateInMenu = 'auto';
            saveNnewItem.visible = false;//!this.hideSaveAndNew;
            saveNnewItem.disabled = false;

            var saveNnewItemOption = new ToolbarItemOption();
            saveNnewItemOption.icon = 'save';
            saveNnewItemOption.text = 'Save & New';
            saveNnewItemOption.onClick = () => {
                this.saveNew.emit();
            };
            saveNnewItem.options = saveNnewItemOption;
            this.toolbaritems.push(saveNnewItem);


            //save and close menu
            var saveNcloseItem = new ToolbarItem();
            saveNcloseItem.location = 'after';
            saveNcloseItem.widget = 'dxButton';
            saveNcloseItem.locateInMenu = 'auto';
            saveNcloseItem.visible = !this.hideSaveAndClose;
            saveNcloseItem.disabled = false;

            var saveNcloseItemOption = new ToolbarItemOption();
            saveNcloseItemOption.icon = 'save';
            saveNcloseItemOption.text = 'Save & Close';
            saveNcloseItemOption.onClick = () => {
                this.saveClose.emit();
            };
            saveNcloseItem.options = saveNcloseItemOption;
            this.toolbaritems.push(saveNcloseItem);

        }

        //close menu
        var closeItem = new ToolbarItem();
        closeItem.location = 'after';
        closeItem.widget = 'dxButton';
        closeItem.locateInMenu = 'auto';
        closeItem.visible = true;
        closeItem.disabled = false;

        var closeItemOption = new ToolbarItemOption();
        closeItemOption.icon = 'clear';
        closeItemOption.text = 'Close';
        closeItemOption.onClick = () => {
            this.close.emit();
        };
        closeItem.options = closeItemOption;
        this.toolbaritems.push(closeItem);

    }

    //add list page toolbar
    addListPageToolbarItem(externalItem: any): void {

        //external toolbar
        for (let item in externalItem) {
            this.toolbaritems.push(externalItem[item]);
        }

        //entity caption
        var titleItem = new ToolbarItem();
        titleItem.id = 1;
        titleItem.location = 'before';
        titleItem.locateInMenu = 'never';
        titleItem.visible = true;
        titleItem.disabled = false;
        titleItem.template = () => {
            return '<div  id=\'tb-title-lbl-id\' style=\'font-size:16px; color:#ffffff;\' class=\'toolbar-label\'>' + this.title + '</div>';
        };
        this.toolbaritems.push(titleItem);

        //new menu
        var newItem = new ToolbarItem();
        newItem.id = 2;
        newItem.location = 'after';
        newItem.widget = 'dxButton';
        newItem.locateInMenu = 'auto';
        newItem.visible = true;
        newItem.disabled = false;

        var newItemOption = new ToolbarItemOption();
        newItemOption.icon = 'add';
        newItemOption.text = 'New';
        newItemOption.onClick = () => {
            this.new.emit();
        };
        newItem.options = newItemOption;
        this.toolbaritems.push(newItem);


        //delete menu
        var deleteItem = new ToolbarItem();
        deleteItem.id = 3;
        deleteItem.location = 'after';
        deleteItem.widget = 'dxButton';
        deleteItem.locateInMenu = 'auto';
        deleteItem.visible = true;
        deleteItem.disabled = false;

        var deleteItemOption = new ToolbarItemOption();
        deleteItemOption.icon = 'trash';
        deleteItemOption.text = 'Delete';
        deleteItemOption.onClick = () => {
            this.delete.emit();
        };
        deleteItem.options = deleteItemOption;
        this.toolbaritems.push(deleteItem);


        //refresh menu
        var refreshItem = new ToolbarItem();
        refreshItem.id = 4;
        refreshItem.location = 'after';
        refreshItem.widget = 'dxButton';
        refreshItem.locateInMenu = 'auto';
        refreshItem.visible = true;
        refreshItem.disabled = false;

        var refreshItemOption = new ToolbarItemOption();
        refreshItemOption.icon = 'refresh';
        refreshItemOption.text = 'Refresh';
        refreshItemOption.onClick = () => {
            this.refresh.emit();
        };
        refreshItem.options = refreshItemOption;
        this.toolbaritems.push(refreshItem);


        //close menu
        var closeItem = new ToolbarItem();
        closeItem.id = 5;
        closeItem.location = 'after';
        closeItem.widget = 'dxButton';
        closeItem.locateInMenu = 'auto';
        closeItem.visible = true;
        closeItem.disabled = false;

        var closeItemOption = new ToolbarItemOption();
        closeItemOption.icon = 'clear';
        closeItemOption.text = 'Close';
        closeItemOption.onClick = () => {
            this.close.emit();
        };
        closeItem.options = closeItemOption;
        this.toolbaritems.push(closeItem);

    }

    //add link page toolbar
    addLinkPageToolbarItem(): void {

        //entity caption
        var titleItem = new ToolbarItem();
        titleItem.id = 1;
        titleItem.location = 'before';
        titleItem.locateInMenu = 'never';
        titleItem.visible = true;
        titleItem.disabled = false;
        titleItem.template = () => {
            return '<div id=\'tb-title-lbl-id\' style=\'font-size:16px; color:#ffffff;\' class=\'toolbar-label\'>' + this.title + '</div>';
        };
        this.toolbaritems.push(titleItem);

        //close menu
        var closeItem = new ToolbarItem();
        closeItem.id = 5;
        closeItem.location = 'after';
        closeItem.widget = 'dxButton';
        closeItem.locateInMenu = 'auto';
        closeItem.visible = true;
        closeItem.disabled = false;

        var closeItemOption = new ToolbarItemOption();
        closeItemOption.icon = 'clear';
        closeItemOption.text = 'Close';
        closeItemOption.onClick = () => {
            this.close.emit();
        };
        closeItem.options = closeItemOption;
        this.toolbaritems.push(closeItem);

    }

    //initialize toolbar. This will be initialized from parent component
    initializeToolbar(title: string, item: any, toolbarType: ToolbarType, hideDefaultMenu: boolean = false) {

        if (this.isinitialize) return;
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
            case ToolbarType.ListPage: {

                this.addListPageToolbarItem(item);
                break;
            }
            case ToolbarType.ListTabPage: {

                this.toolbarClass = 'toolbar-outer-area-tab-page';
                this.addListPageToolbarItem(item);
                break;
            }
            case ToolbarType.DetailPage: {

                this.addDetailPageToolbarItem(item);
                break;
            }
            case ToolbarType.DetailTabPage: {

                this.toolbarClass = 'toolbar-outer-area-tab-page';
                this.addDetailPageToolbarItem(item);
                break;
            }
            case ToolbarType.LinkPage: {

                this.addLinkPageToolbarItem();
                break;
            }
            case ToolbarType.TabPage: {
                break;
            }
            default:
                break;
        }


    }

    setToolbarTitle(title: string): void {
        this.title = title;
        $('#tb-title-lbl-id').text(title);
    }
}

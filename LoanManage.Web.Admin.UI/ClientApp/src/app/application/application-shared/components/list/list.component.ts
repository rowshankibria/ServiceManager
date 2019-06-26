import { Component, ViewChild, Input, ElementRef, AfterViewInit, HostListener, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';
import { ListService } from './../../services/list.service';
import { ActivatedRoute, Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { confirm, alert } from 'devextreme/ui/dialog';
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { Observable } from 'rxjs';
import { MessageService } from './../../../../shared/services/message.service'
import { NavigationService } from './../../../../shared/services/navigation.service'
import { ToolbarItem, ToolbarItemOption } from '../../../application-shared/components/titlebar/toolbar-item';

import { ToolbarType } from './../../../application-shared/components/titlebar/utilities';
import { retry } from 'rxjs/operators';

declare var $: any;

@Component({
    selector: 'app-dx-data-grid',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})

export class ListComponent implements AfterContentChecked {

    dataSource: any = [];
    columns: any = [];
    currentFilter: any = {};
    gridHeight: number = 500;
    selectedRows: string[];
    toolbarAdditionalItems: ToolbarItem[];
    listPage: any;
    contentClass: any = "list-page-content-div";
    toolbarType: any = ToolbarType.ListPage;
    listTabGridHeightToReduce: any = 140;
    listGridHeightToReduce: any = 95;

    @Output() onContextMenuPreparing: EventEmitter<any> = new EventEmitter<any>();
    @Output() onGridNewButtonClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() onGridEditLinkClick: EventEmitter<any> = new EventEmitter<any>();

    @Input('PageComponentKey') pageComponentKey: any;

    @Input('UniqueEntityId') uniqueEntityId: any;
    @Input('EntityId') entityId: any;
    @Input('ReturnUrl') returnUrl: string;

    @Input('OpenInSameContainer') openInSameContainer: boolean = false;

    pageRoutingUrl: any = '';
    getServiceUrl: string;
    deleteServiceUrl: string;

    newNavigationUrl: string;
    closeNavigationUrl: string;
    editNavigationUrl: string;

    @ViewChild(TitlebarComponent)
    private listTitlebar: TitlebarComponent;

    @ViewChild('grdCompany')
    dataGrid: DxDataGridComponent;

    @HostListener('window:resize') onResize() {

        if (this.toolbarType == ToolbarType.ListTabPage)
            this.gridHeight = window.innerHeight - this.listTabGridHeightToReduce;
        else
            this.gridHeight = window.innerHeight - this.listGridHeightToReduce;

    }

    constructor(private listservice: ListService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private navigationService: NavigationService
    ) {

        this.toolbarAdditionalItems = [];
        this.pageRoutingUrl = this.router.url;
    }

    /**
     * ngOnInit event
     */
    ngOnInit() {
        //if (this.pageComponentKey == null || this.pageComponentKey == undefined) {
        //    this.routingUrl = this.router.url;
        //}
       
        this.getListPageInfo();
    }

    /*
    * set page information
    */
    getListPageInfo(): void {

        if (this.pageComponentKey != null && this.pageComponentKey != undefined) {
            this.listservice.getPageInfoByName(this.pageComponentKey)
                .subscribe(data => {
                    this.setPageProperty(data);
                    this.listTitlebar.initializeToolbar(this.listPage.title, this.toolbarAdditionalItems, ToolbarType.ListTabPage);
                    this.contentClass = "list-page-content-div-tab";
                    this.toolbarType = ToolbarType.ListTabPage;
                    this.gridHeight = window.innerHeight - this.listTabGridHeightToReduce;
                });
        }
        else {
            this.listservice.getPageInfoByRoutingUrl(this.pageRoutingUrl)
                .subscribe(data => {
                    this.setPageProperty(data);
                    this.listTitlebar.initializeToolbar(this.listPage.title, this.toolbarAdditionalItems, ToolbarType.ListPage);
                    this.toolbarType = ToolbarType.ListPage;
                    this.gridHeight = window.innerHeight - this.listGridHeightToReduce;
                });
        }
    }

    private setPageProperty(data: any) {
        this.listPage = data.result;
        this.columns = this.listPage.fields;
        this.setServiceUrl();
        this.setGridDataSource();
        this.setNavigationUrl();
    }

    /**
     * Set Service url
     * @param serviceName
     */
    setServiceUrl(): void {
        this.getServiceUrl = this.listPage.pageServiceUrls.find(c => c.serviceName === 'GetServiceUrl').serviceUrl;
        if (!this.getServiceUrl) {
            this.messageService.showInvalidServiceUrlMsg('GetServiceUrl');
        }
        
        if (this.uniqueEntityId != '' && this.uniqueEntityId != null && this.uniqueEntityId != undefined) {
            this.getServiceUrl = this.getServiceUrl + this.uniqueEntityId;
            if (this.entityId > 0)
                this.getServiceUrl = this.getServiceUrl + '/'
        }

        if (this.entityId > 0) {
            this.getServiceUrl = this.getServiceUrl + this.entityId;
        }

        this.deleteServiceUrl = this.listPage.pageServiceUrls.find(c => c.serviceName === 'DeleteServiceUrl').serviceUrl;
        if (!this.deleteServiceUrl) {
            this.messageService.showInvalidServiceUrlMsg('DeleteServiceUrl')
        }
    }

    /**
    * Set Navigation url
    * @param serviceName
    */
    setNavigationUrl(): void {

        if (!this.newNavigationUrl) {
            this.newNavigationUrl = this.listPage.pageNavigationUrls.find(c => c.linkName === 'New').navigateUrl;
            if (!this.newNavigationUrl) {
                this.messageService.showInvalidNavigationUrlMsg('Invalid Configuration');
            }
        }
        if (!this.editNavigationUrl) {
            this.editNavigationUrl = this.listPage.pageNavigationUrls.find(c => c.linkName === 'Edit').navigateUrl;
            if (!this.editNavigationUrl) {
                this.messageService.showInvalidNavigationUrlMsg('Invalid Configuration');
            }
        }

        if (!this.closeNavigationUrl) {
            this.closeNavigationUrl = this.listPage.pageNavigationUrls.find(c => c.linkName === 'Close').navigateUrl;
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
    }

    /*
    * Data source binding
    */
    setGridDataSource(): void {

        this.dataSource = new DataSource({
            load: (loadOptions: any) => {

                return this.listservice.getDxGridRecords(this.getServiceUrl, loadOptions).toPromise().then((response: any) => {
                    return {
                        data: response.result.data,
                        totalCount: response.result.totalCount
                    }

                });
            }
        });

    }

    ngAfterContentChecked(): void {
        $('.dx-datagrid-header-panel .dx-toolbar-items-container').css("display", "none");
        $('.dx-datagrid-filter-row .dx-editor-cell .dx-texteditor-input').attr("placeholder", "Search...");
    }



    /**
     * grid onToolbarPreparing event
     */
    onToolbarPreparing(e) {
        this.toolbarAdditionalItems = [];
        var toolbarItems = e.toolbarOptions.items;

        // Modifies an existing item
        toolbarItems.forEach((item) => {
            if (item.name == "searchPanel") {
                this.toolbarAdditionalItems.push(item);
            }
        })
    }

    onGridContextMenuPreparing(e) {
        this.onContextMenuPreparing.emit(e);
    }


    /**
     * On new button clicked
     */
    onNewClicked(): void {

        if (this.openInSameContainer) {
            this.onGridNewButtonClick.emit();
        }
        else {
            this.navigationService.navigateAndSetReturnUrl(this.newNavigationUrl, this.router.url);
        }
    }

    /**
     * on delete button clicked
     */
    onDeleteClicked(): void {
        if (this.selectedRows == undefined || this.selectedRows.length == 0) {
            this.messageService.showInvalidSelectionMsg();
        }
        else {
            var result = this.messageService.showDeleteConfirmMsg(this.selectedRows.length);
            result.then(dialogResult => {
                if (dialogResult) {
                    this.deleteRecord();
                }
            });
        }
    }

    /**
     * on close button clicked
     */
    onCloseClicked(): void {

        if (this.returnUrl != '' && this.returnUrl != null && this.returnUrl != undefined) {
            this.navigationService.navigate(this.returnUrl);
        }
        else {
            this.navigationService.navigateToReturnurl(this.router.url);
        }
    }

    /**
     * on refresh button clicked
     */
    onRefreshClicked(): void {
        this.dataGrid.instance.clearFilter();
        this.dataGrid.instance.clearSelection();
        this.dataGrid.instance.clearSorting();
        this.dataGrid.instance.refresh();
    }

    /**
     * delete records
     */
    deleteRecord(): void {

        if (this.selectedRows != undefined && this.selectedRows.length > 0) {

            var recordIds: any[] = [];
            //external toolbar
            for (let item in this.selectedRows) {
                recordIds.push(this.selectedRows[item]["id"]);
            }
            if (recordIds.length > 1) {
                this.listservice.deleteRecords(this.deleteServiceUrl, recordIds).subscribe(data => {
                    this.messageService.showDataDeletedMsg();
                    this.selectedRows = [];
                    this.dataGrid.instance.getDataSource().reload();
                });
            }
            else {

                this.listservice.deleteRecord(this.deleteServiceUrl, recordIds[0]).subscribe(data => {
                    this.messageService.showDataDeletedMsg();
                    this.selectedRows = [];
                    this.dataGrid.instance.getDataSource().reload();
                });
            }
        }

    }

    /**
     * go to detail page udate record
     * @param data
     */
    onNameEditTemplateLinkClick(data: any) {
        
        if (this.openInSameContainer) {
            this.onGridEditLinkClick.emit(data.key);
        }
        else {

            this.navigationService.navigateToNewTab(this.editNavigationUrl + data.key.id);
        }
    }

    onNameEditTemplateEditIconClick(data: any) {
        this.navigationService.navigateAndSetReturnUrl(this.editNavigationUrl + data.key.id, this.router.url);
    }


    onEditorPreparing(e) {
        if (e.parentType == 'filterRow' && e.dataType == "boolean" && e.editorName == "dxSelectBox") {
            e.trueText = "Yes";
            e.falseText = "No";
        }
        //if (e.parentType == "filterRow") {
        //    //e.editorOptions.inputAttr = { 'autocomplete': "off" }
        //    e.editorOptions.inputAttr = { 'placeholder' : 'search...' }
        //}
    }

}



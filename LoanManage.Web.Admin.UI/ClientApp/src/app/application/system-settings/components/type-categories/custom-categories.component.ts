import { Component, ViewChild, Input, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';
import { TypeAndCategoryService } from './../../services/type-and-category.service';
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
    selector: 'app-dx-data-grid-test',
    templateUrl: './custom-categories.component.html',
    styleUrls: ['./custom-categories.component.scss'],
})

export class CustomCategoriesComponent implements AfterViewInit {
    dataSource: any = [];
    columns: any = [];
    currentFilter: any = {};
    gridHeight: number = 500;
    selectedRows: string[];
    toolbarAdditionalItems: ToolbarItem[];
    pageTitle: any = '';
    showMapType: any = true;

    returnUrl: string = '';
    categoryRoutingKey: string;

    getServiceUrl: string;
    deleteServiceUrl: string;

    newNavigationUrl: string;
    closeNavigationUrl: string;
    editNavigationUrl: string = '';
    contentClass: any = "detail-page-content-div";

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('grdCompany')
    dataGrid: DxDataGridComponent;

    @HostListener('window:resize') onResize() {
        this.gridHeight = window.innerHeight - 110
    }

    constructor(private customCategoryService: TypeAndCategoryService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private navigationService: NavigationService
    ) {

        this.toolbarAdditionalItems = [];

        this.route.params.subscribe(params => {
            if (params['routingKey'] !== undefined) {
                this.categoryRoutingKey = params['routingKey'];
                this.newNavigationUrl = 'system-settings/type-and-category/' + this.categoryRoutingKey + '/new';
                this.editNavigationUrl = 'system-settings/type-and-category/' + this.categoryRoutingKey + '/';
                this.closeNavigationUrl = '/';
            }
        });
    }


    /**
     * ngOnInit event
     */
    ngOnInit() {

        this.gridHeight = window.innerHeight - 110;


       
        this.setGridDataSource();
        this.setPageInfo();
    }

    private setPageInfo() {
        this.customCategoryService.getCustomCategoryTypeByKeyAsync(this.categoryRoutingKey).toPromise().then((response: any) => {
            this.pageTitle = response.result.name;
            this.showMapType = response.result.customCategoryMapTypeId > 0;
            this.columns = this.getFields();
            this.titlebar.setToolbarTitle(this.pageTitle);
        });
    }

    private getFields() {
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
        ]
        return a;
    }

    /*
    * Data source binding
    */
    setGridDataSource(): void {

        this.dataSource = new DataSource({
            load: (loadOptions: any) => {
                return this.customCategoryService.getDxGridCustomCategories(this.categoryRoutingKey, loadOptions).toPromise().then((response: any) => {
                    return {
                        data: response.result.data,
                        totalCount: response.result.totalCount
                    }
                });
            }
        });

    }


    /**
     * ngAfterViewInit event
     */
    ngAfterViewInit() {
        // Hide grid toolbar
        $('.dx-datagrid-header-panel .dx-toolbar-items-container').css("display", "none");

        this.titlebar.initializeToolbar(this.pageTitle, this.toolbarAdditionalItems, ToolbarType.ListPage);
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
        });

        this.addToolbarAdditionalItems();

    }



    private addToolbarAdditionalItems() {
        //Move Up
        var moveUpItem = new ToolbarItem();
        moveUpItem.location = 'after';
        moveUpItem.widget = 'dxButton';
        moveUpItem.locateInMenu = 'auto';
        moveUpItem.visible = true;
        moveUpItem.disabled = false;
        var moveUpItemOption = new ToolbarItemOption();
        moveUpItemOption.icon = 'chevronup';
        moveUpItemOption.text = 'Up';
        moveUpItemOption.onClick = () => {
            this.onMoveUp();
        };
        moveUpItem.options = moveUpItemOption;
        this.toolbarAdditionalItems.push(moveUpItem);

        //Move Down
        var moveDownItem = new ToolbarItem();
        moveDownItem.location = 'after';
        moveDownItem.widget = 'dxButton';
        moveDownItem.locateInMenu = 'auto';
        moveDownItem.visible = true;
        moveDownItem.disabled = false;
        var moveDownItemOption = new ToolbarItemOption();
        moveDownItemOption.icon = 'chevrondown';
        moveDownItemOption.text = 'Down';
        moveDownItemOption.onClick = () => {
            this.onMoveDown();
        };
        moveDownItem.options = moveDownItemOption;
        this.toolbarAdditionalItems.push(moveDownItem);
    }

    onMoveUp(): void {

        if (this.selectedRows != undefined && this.selectedRows.length > 0) {

            this.customCategoryService.moveUpCustomCategory(this.selectedRows[0]["id"]).toPromise().then((response: any) => {
                if (response) {

                    this.dataGrid.instance.getDataSource().reload();
                    this.dataGrid.instance.clearSorting();
                    this.dataGrid.instance.columnOption('displayOrder', {
                        sortOrder: 'asc',
                        sortIndex: 1
                    });
                }
            });
        }
    }

    onMoveDown(): void {
        if (this.selectedRows != undefined && this.selectedRows.length > 0) {
            this.customCategoryService.moveDownCustomCategory(this.selectedRows[0]["id"]).toPromise().then((response: any) => {
                if (response) {

                    this.dataGrid.instance.getDataSource().reload();
                    this.dataGrid.instance.clearSorting();
                    this.dataGrid.instance.columnOption('displayOrder', {
                        sortOrder: 'asc',
                        sortIndex: 1
                    });
                     
                }
            });
        }
    }

    onContentReady(e) {
        console.log('onContentReadyAction');
        if (this.selectedRows != undefined && this.selectedRows.length > 0) {
            //e.component.selectRows([this.selectedRows[0]["id"]], true);
        }
    }

    /**
     * On new button clicked
     */
    onNewClicked(): void {

        //this.router.navigate([this.newNavigationUrl]);
        this.navigationService.navigateAndSetReturnUrl(this.newNavigationUrl, this.router.url);
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
        var returnUrl = "system-settings/types-and-categories";
        this.navigationService.navigate(returnUrl);
        //this.navigationService.navigateToReturnurl(this.router.url)
    }

    /**
     * on refresh button clicked
     */
    onRefreshClicked(): void {
        this.dataGrid.instance.clearFilter();
        this.dataGrid.instance.clearSelection();
        this.dataGrid.instance.clearSorting();
        this.dataGrid.instance.refresh();
        this.dataGrid.instance.columnOption('displayOrder', {
            sortOrder: 'asc',
            sortIndex: 1
        });
    }

    /**
     * delete records
     */
    deleteRecord(): void {

        if (this.selectedRows != undefined && this.selectedRows.length > 0) {

            //var recordIds: any[] = [];
            ////external toolbar
            //for (let item in this.selectedRows) {
            //    recordIds.push(this.selectedRows[item]["id"]);
            //}

            this.customCategoryService.deleteEntity(this.selectedRows[0]["id"]).subscribe(data => {
                this.messageService.showDataDeletedMsg();
                this.selectedRows = [];
                this.dataGrid.instance.getDataSource().reload();
            });
        }

    }

    /**
     * go to detail page udate record
     * @param data
     */
    updateRecords(data: any) {
        //this.router.navigate([this.editNavigationUrl + data.key.id]);

        this.navigationService.navigateAndSetReturnUrl(this.editNavigationUrl + data.key.id, this.router.url)
    }

    onEditorPreparing(e) {
        
        if (e.parentType == 'filterRow' && e.dataType == "boolean" && e.editorName == "dxSelectBox") {
            e.trueText = "Yes";
            e.falseText = "No";
        }
        else if (e.parentType == 'filterRow' && e.dataType == "date" && e.editorName == "dxDateBox") {
            e.editorOptions.displayFormat = "dd/MM/yyyy"
        }
        //if (e.parentType == "filterRow") {
        //    e.editorOptions.inputAttr = { 'autocomplete': "off" }
        //}
    }

}



import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, Input } from '@angular/core';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';
//import { AddressService } from '../../services/address.service';
import { ActivatedRoute, Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { confirm, alert } from 'devextreme/ui/dialog';
import { TitlebarComponent } from './../../application-shared/components/titlebar/titlebar.component';
import { Observable } from 'rxjs';
import { MessageService } from './../../../shared/services/message.service'
import { NavigationService } from './../../../shared/services/navigation.service'
import { ListComponent } from './../../../application/application-shared/components/list/list.component'
import { ToolbarItem, ToolbarItemOption } from '../../application-shared/components/titlebar/toolbar-item';
//import { EntityModel } from '../../models/entityModel';
import { debounce } from 'rxjs/operator/debounce';
import { ClipboardService } from 'ngx-clipboard';
import { DmsService } from './../services/dms.service';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss']
})
/** addresses component*/
export class DocumentsComponent implements AfterViewInit {
    //@Input() entityModel: EntityModel;

    dataSource: any = [];
    currentFilter: any = {};
    gridHeight: number = 500;
    selectedRows: string[];
    toolbarAdditionalItems: ToolbarItem[];
    pageKey: string = 'documents';

    publicKey: string = '';

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('grdDocument')
    grdDocument: ListComponent;

    @HostListener('window:resize') onResize() {
        //this.gridHeight = window.innerHeight - 110
    }

    constructor(private dmsService: DmsService,
        private clipboardService: ClipboardService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {

        this.toolbarAdditionalItems = [];


        //this.grdDocument.
    }

    /**
 * ngOnInit event
 */
    ngOnInit() {
        //debugger;
        //this.init();
        //this.gridheight = window.innerheight - 110;
    }

    /**
* Data source binding
* */
    init(): void {
        //this.dataSource = new DataSource({
        //    load: (loadOptions: any) => {
        //        return this.addressservice.getDxGridAddress(this.entityModel.entityType, this.entityModel.entityId, loadOptions).toPromise().then((response: any) => {
        //            return {
        //                data: response.result.data,
        //                totalCount: response.result.totalCount
        //            }
        //        });
        //    }
        //});
    }

    ngAfterViewInit(): void {
        // throw new Error("Method not implemented.");
    }


    onContextMenuPreparing(e) {

        var clipboard = this.clipboardService;        
        var baseUrl = window.location.origin;

        var dmsService = this.dmsService;
        
        if (e.row.rowType === "data") {
            e.items = [{
                text: "Download",
                icon: "download",
                onItemClick: function ()
                {
                    dmsService.downloadLatestFile(e.row.data.id);
                }
            },
            {
                text: "Copy Private Url",
                icon: "message",
                onItemClick: function () {
                    clipboard.copyFromContent(baseUrl + '/dms/document/download/' + e.row.data.fileId);
                }
            },
            {
                text: "Copy Public Url",
                icon: "message",
                onItemClick: function () {                    
                    clipboard.copyFromContent(baseUrl + '/resource/' + e.row.data.publickey);
                }
            }];
        }
    }


}

import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';
import { CompanyService } from './../../services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { confirm, alert } from 'devextreme/ui/dialog';
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { MessageService } from './../../../../shared/services/message.service'
import { ToolbarItem, ToolbarItemOption } from '../../../application-shared/components/titlebar/toolbar-item';
import { CompanyFormComponent } from '../company/company-form.component';
import { ToolbarType } from './../../../application-shared/components/titlebar/utilities';
import { Location } from '@angular/common';

@Component({
    selector: 'app-companies',
    templateUrl: './companies.component.html',
    styleUrls: ['./companies.component.scss'],
})

export class CompaniesComponent implements AfterViewInit {
    dataSource: any = [];
    currentFilter: any = {};
    gridHeight = 500;
    selectedRows: string[];
    toolbarAdditionalItems: ToolbarItem[];

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('grdCompany')
    grdCompany: DxDataGridComponent;

    @HostListener('window:resize') onResize() {
        this.gridHeight = window.innerHeight - 110
    }

    constructor(private companyservice: CompanyService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private location: Location
    ) {

        this.toolbarAdditionalItems = [];
    }

    /**
     * ngOnInit event
     */
    ngOnInit(): void {

        this.init();
        this.gridHeight = window.innerHeight - 110;
    }

    /**
     * ngAfterViewInit event
     */
    ngAfterViewInit() {
        this.titlebar.initializeToolbar('Companies', this.toolbarAdditionalItems, ToolbarType.ListPage);
    }

    /**
     * On new button clicked
     */
    onNewClicked(): void {
        this.router.navigate(['crm/new-company']);
    }

    /**
     * on delete button clicked
     */
    onDeleteClicked(): void {

        if (this.selectedRows === undefined) {
            this.messageService.warning('Please select one or more records from the list and try again.', 'Invalid Selection');
        } else {

            var result = confirm("You are about to delete " + this.selectedRows.length + " record(s). This process can not be reverted. Do you want to continue?", "Delete Confirmation");
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
        this.router.navigate(['/']);
    }

    /**
     * on refresh button clicked
     */
    onRefreshClicked(): void {
        this.grdCompany.instance.refresh();
    }

    //get records
    getData(): void {
        this.companyservice.getCompanies().subscribe(data => {
            return {
                data: data.result.companies,
            }
        });
    }

    /**
    * Data source binding
    * */
    init(): void {
        this.dataSource = new DataSource({
            load: (loadOptions: any) => {

                return this.companyservice.getDxGridCompanies(loadOptions).toPromise().then((response: any) => {
                    return {
                        data: response.result.data,
                        totalCount: response.result.totalCount
                    }

                });
            }
        });
    }

    /**
     * delete records
     */
    deleteRecord(): void {
        if (this.selectedRows != undefined) {

            var recordIds: any[] = [];
            //external toolbar
            for (let item in this.selectedRows) {
                recordIds.push(this.selectedRows[item]["id"]);
            }

            this.companyservice.deleteCompanies(recordIds).subscribe(data => {
                this.messageService.success("Company delete successfully.", 'Information');
                this.selectedRows = undefined;
                this.grdCompany.instance.getDataSource().reload();
            });
        }

    }

    /**
     * go to detail page udate record
     * @param data
     */
    updateRecords(data: any) {


        this.location.replaceState("/some/newstate/");
    }
}



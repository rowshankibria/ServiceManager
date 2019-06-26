import { Component, AfterViewInit, ViewChild, OnInit, Input, AfterViewChecked } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { LoanApplicationService } from '../services/loan-application.service';
import { MessageService, AppMessage } from './../../../shared/services/message.service';
import { TitlebarComponent } from './../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../application-shared/components/titlebar/utilities';
import { NavigationService } from '../../../shared/services/navigation.service';
import { FileUploaderComponent } from './fileuploader.component';
import CustomStore from "devextreme/data/custom_store";
import {
    DxNumberBoxComponent, DxTextBoxComponent, DxTextAreaComponent, DxSelectBoxComponent, DxDataGridComponent,
    DxButtonComponent, DxRadioGroupComponent, DxTextAreaModule
} from 'devextreme-angular';
import { EntityModel } from '../../system-service/models/entityModel';
import { ToolbarItem, ToolbarItemOption } from '../../application-shared/components/titlebar/toolbar-item';
import { ApprovalStatusMapType, LoanStatusMapType, ApproverGroupTypeMapType } from '../../application-shared/components/titlebar/utilities';
declare var $: any;

@Component({
    selector: 'app-fileuploader-form',
    templateUrl: './fileuploader-form.component.html',
    styleUrls: ['./fileuploader-form.component.scss'],
})

export class FileUploaderFormComponent implements AfterViewChecked {


    applicationDocumentList: any = [];
    loanApplicationModel: any = [];
    applicationId: any = 0;
    loanStatusMapTypeId: any = 0;
    disableItem: boolean = false;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('fileUploadControl')
    private fileUploadControl: FileUploaderComponent;

    entityTitle: string = "Document";
    toolbarType: ToolbarType = ToolbarType.DetailPage;


	/**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    constructor(private loanService: LoanApplicationService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.route.params.subscribe(params => {
            if (params['applicationId'] !== undefined) {
                this.applicationId = params['applicationId'];
                this.toolbarType = ToolbarType.DetailPage;
            }
        });


    }

    ngOnInit(): void {

        //if(this.applicationId > 0)
        //    this.addToolbarAdditionalItems();
        this.init();
    }

    ngAfterViewInit(): void {


    }



    ngAfterViewChecked(): void {
        // ...

    }

    /************************************************ Method Start *********************************** */


    /**
     * Init method
     **/
    init(): void {

        this.loanService.getApplicationDocumentList(this.applicationId).subscribe(data => {

            this.applicationDocumentList = data.result,               
                this.titlebar.initializeToolbar("Documents", null, this.toolbarType, this.disableItem);
        });

    }

    onDownloadClicked(id: any, fileName: any) {

        this.loanService.downloadLatestFile(id, fileName);
    }
    

    /*****************************  Credit Officer Start ******************************** */



    validateAndSave(action: DetailPageAction): void {

        this.saveEntity(action);
    }


    saveEntity(action: DetailPageAction): void {

        if (this.fileUploadControl.getFileDataSource().length == 0) {
            this.messageService.warning(AppMessage.InvalidDocuemtUpload, "Information");
            return;
        }

        this.loanService.uploadDocumentList(this.applicationId, this.fileUploadControl.getFileDataSource()).subscribe(data => {
            this.messageService.success("Record has been saved successfully", 'Information');
            this.fileUploadControl.fileDataSource = [];
            this.init();

        });

    }

    redirectToListPage(action: DetailPageAction): void {
        //debugger;
        var newNavigationUrl = '/loan/applications';


        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.applicationId, this.router.url);
        }
    }

    onSaveClicked(e): void {
        this.validateAndSave(DetailPageAction.Save);
    }

    onSaveNNewClicked(e): void {
        this.validateAndSave(DetailPageAction.SaveAndNew);
    }

    onSaveNCloseClicked(e): void {
        this.validateAndSave(DetailPageAction.SaveAndClose);
    }

    onCloseClicked(e): void {
        this.redirectToListPage(DetailPageAction.Close);
    }

    onDeleteDocument(data): void {

        this.loanService.deleteDocumentRecord(data).subscribe(data => {
            this.messageService.success("Record has been deleted successfully", 'Information');
            this.init();
        });

    }
}

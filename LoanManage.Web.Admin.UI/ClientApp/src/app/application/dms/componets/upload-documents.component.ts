import { Component, Input, AfterViewInit, ViewChild, Inject } from '@angular/core';
import {
    DxDropDownBoxComponent, DxValidationGroupComponent, DxFileUploaderComponent, DxValidatorComponent, DxSelectBoxComponent, DxTextAreaComponent, DxTagBoxComponent
} from 'devextreme-angular';
import { MessageService, AppMessage } from './../../../shared/services/message.service';
import { NavigationService } from './../../../shared/services/navigation.service';
import { ApiHttpService } from './../../../shared/services/api-http.service';
import { FileUploadComponent } from './file-upload.component';
import { DmsService } from './../services/dms.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TitlebarComponent } from './../../application-shared/components/titlebar/titlebar.component';
import { ToolbarType, DetailPageAction } from './../../application-shared/components/titlebar/utilities';
import { EntitySelectBoxComponent } from './../../application-shared/components/common/app-entity-select-box.component';
import { alert } from 'devextreme/ui/dialog';

@Component({
    selector: 'dms-upload-documents',
    templateUrl: './upload-documents.component.html',
    styleUrls: ['./upload-documents.component.scss'],
})

export class UploadDocumentsComponent {

    @Input() documentId: any = 0;
    documentDataSource: any = [];
    documentTypeDataSource: any = [];
    documentForDataSource: any = [];
    businessProfileDataSource: any = [];
    fileDataSource: any = [];
    fileRevisionsDataSource: any = [];
    documentTypeFilterDataSource: any = [];    
    isDisabledBusinessProfile: boolean= false;


    entityClass: string = "row form-group";
    hideEntityClass: string = "row form-group item-invisible"
    showEntityClass: string = "row form-group";
    contentClass: any = "detail-page-content-div";

    toolbarType: ToolbarType = ToolbarType.DetailPage;

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild(EntitySelectBoxComponent)
    private documentEntitySelectionBox: EntitySelectBoxComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild('fileUploadControl')
    private fileUploadControl: FileUploadComponent


    @ViewChild('businessProfileValidation')
    private businessProfileValidation: DxValidatorComponent;

    @ViewChild('documentForSelectionBoxValidation')
    private documentForSelectionBoxValidation: DxValidatorComponent;

 
    
    constructor(private dmsService: DmsService,
        private messageService: MessageService,
        private navigationService: NavigationService,
        private apiHttpService: ApiHttpService,
        private route: ActivatedRoute,
        private router: Router) {

        //this.uploadUrl = apiHttpService.getApiUrl('shared/file-upload/upload-photo');
        //this.sourceUrl = apiHttpService.getRootUrl('images/');

        this.route.params.subscribe(params => {
            if (params['documentId'] != undefined) {
                this.documentId = params['documentId'];
            }
        });

    }

    ngOnInit(): void {

        this.setDataSource();
    
        this.attachValidationToControl();
        //this.businessProfileValidation.validationRules = [{ type: 'required', message: 'Business Profile is required.' }];
    }


    attachValidationToControl() {

        //validation   
        this.businessProfileValidation.validationRules = [{ type: 'required', message: 'Business Profile is required.' }];
        this.documentForSelectionBoxValidation.validationRules = [{ type: 'required', message: 'Document For is invalid' }];
    }

    ngAfterViewInit(): void {
        this.titlebar.initializeToolbar("", null, this.toolbarType);
        if (this.toolbarType == ToolbarType.DetailTabPage) {
            this.contentClass = "detail-page-content-div-tab";
        }
    }

    /**
* Data source binding
* */
    setDataSource(): void {

        this.dmsService.getDocument(this.documentId).toPromise().then((response: any) => {

            this.isDisabledBusinessProfile = !response.result.isDefaultBusinessProfile;
            this.documentTypeDataSource = response.result.documentTypeSelectItems;
            this.documentForDataSource = response.result.documentForSelectItems;
            this.businessProfileDataSource = response.result.businessProfileSelectItems;
            this.fileDataSource = response.result.documentMetadata.files;
            this.fileRevisionsDataSource = response.result.documentMetadata.revisions;

            this.documentDataSource = response.result.documentMetadata;
            
            this.fileUploadControl.setFileDataSource(this.fileDataSource);

            if (this.documentId > 0) {

                this.isDisabledBusinessProfile = true;
                this.fileUploadControl.updateMode = true;
                this.documentEntitySelectionBox.setValue(response.result.documentMetadata.entityId);
               
            }

            this.titlebar.setToolbarTitle(this.documentId == 0 ? "Upload Document: New" : "Document: " + this.documentDataSource.title);

        });


    }

 

    saveEntity(action: DetailPageAction): void {

        if (this.fileUploadControl.getFileDataSource().length == 0) {
            this.messageService.warning(AppMessage.InvalidDocuemtUpload, "Information");
            return;
        }

        this.documentDataSource.entityId = this.documentEntitySelectionBox.getValue();
        this.documentDataSource.files = this.fileUploadControl.getFileDataSource();
       

        if (this.documentId == 0 || this.documentId == null || this.documentId == undefined) {

            this.dmsService.saveDocuments(this.documentDataSource).subscribe(data => {
                
                this.messageService.success("Record has been save successfully", 'Information');
                this.redirectToListPage(action);
            });
        } else {
            
            this.dmsService.updateDocument(this.documentId, this.documentDataSource).subscribe(data => {

                this.messageService.success("Record has been save successfully", 'Information');
                this.redirectToListPage(action);
            });
        }
    }


    /**
 * validate and save data
 */
    validateAndSave(action: DetailPageAction): void {

        if (!this.formValidation.instance.validate().isValid) {
            return;
        }

        this.saveEntity(action);
    }


    /**
 * on save and close button clicked
 */
    onSaveNCloseClicked(e): void {
        
        this.validateAndSave(DetailPageAction.SaveAndClose);
    }

    onCloseClicked(): void {
        this.redirectToListPage(DetailPageAction.Close);
    }

    /**
 * On value changed
 **/
    onDocumentForValueChanged(e): void {
        this.entityClass = this.hideEntityClass;
        
        if (this.documentDataSource.businessProfileId > 0 && this.documentDataSource.entityTypeId) {
            this.entityClass = this.showEntityClass;
            this.documentEntitySelectionBox.setEntityDataSource(this.documentDataSource.entityTypeId, this.documentDataSource.businessProfileId);
        }
    }

    onBusinessProfileValueChanged(e): void {
        
        this.documentTypeFilterDataSource = this.documentTypeDataSource.filter(x => x.businessProfileId == null || x.businessProfileId == this.documentDataSource.businessProfileId )
        this.onDocumentForValueChanged(e);
    }

    /**
* redirect to list page
*/
    redirectToListPage(action: DetailPageAction): void {

        var newNavigationUrl = '/dms/document/upload';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        //else if (action == DetailPageAction.SaveAndNew) {

        //    if (newNavigationUrl + '/new' == this.router.url) {

        //        this.documentId = 0;
        //        this.setDataSource();
        //    }
        //    else {
        //        this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        //    }
        //}
        //else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {

        //    this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.documentId, this.router.url);
        //}
    }

    onDownloadClick(file: any): void
    {
        //alert(JSON.stringify(file));

        let fileName = file.fileName + file.extension

        this.dmsService.downloadFile(file.id, fileName);
    }
    //docId: any = "";
    //downloadClicked(): void
    //{
    //    this.dmsService.downloadFile(this.docId);
    //}

}

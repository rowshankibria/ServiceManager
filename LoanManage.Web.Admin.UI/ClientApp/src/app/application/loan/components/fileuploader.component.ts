import { Component, AfterViewInit, ViewChild, Inject, Input, AfterContentChecked } from '@angular/core';
import {
    DxButtonModule, DxSelectBoxModule, DxFormModule, DxTextBoxModule, DxTextAreaComponent,
    DxValidatorModule, DxValidationGroupComponent, DxFileUploaderComponent, DxValidatorComponent
} from 'devextreme-angular';

import { MessageService } from './../../../shared/services/message.service';
import { ApiHttpService } from './../../../shared/services/api-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoanApplicationService } from '../services/loan-application.service';
declare var $: any;

@Component({
    selector: 'file-uploader',
    templateUrl: './fileuploader.component.html',
    styleUrls: ['./fileuploader.component.scss'],
})

export class FileUploaderComponent implements AfterContentChecked {

    
    fileList: any = [];
    fileDataSource: any = [];
    documentCategorySelectItem: any = [];
    fileTitle: string = '';
    uploadUrl: any;
    applicationId: any = 0;

    @Input("AllowMultipleFilesSelection") allowMultipleFilesSelection: boolean = false;
    entityTypeId: number = 0;
    entityId: number = 0;

    private _updateMode = false;
    @Input("UpdateMode")
    set updateMode(value: boolean) {
        this._updateMode = value;
        if (value) {
            this.allowMultipleFilesSelection = false;
        }
    }
    get updateMode(): boolean {
        return this._updateMode;
    }

    @ViewChild('fileUpload')
    private fileUpload: DxFileUploaderComponent;

    /**
     * 
     * @param messageService
     */
    constructor(
        private loanService: LoanApplicationService
        , private messageService: MessageService
        , private apiHttpService: ApiHttpService
        , private route: ActivatedRoute
        , private router: Router) {
        
        this.uploadUrl = apiHttpService.getApiUrl('shared/file-upload/upload-file');

        this.route.params.subscribe(params => {
            if (params['applicationId'] !== undefined) {
                this.applicationId = params['applicationId'];               
            }
        });
    }

    ngAfterContentChecked(): void {
        $('.dx-fileuploader-files-container').hide();
    }

    /**
     * set entity values
     * @param photo
     */
    setFileDataSource(fileDataSource: any) {
        this.fileDataSource = fileDataSource;      
    }

    /**
     * set entity values
     * @param photo
     */
    getFileDataSource() {
        return this.fileDataSource;
    }


    /**
     * DxFileUploader-onUploadStarted event
     * @param e
     */
    onUploadStarted(e) {
                
        if (e.file.size > 6000000) {
            this.messageService.error("File: "+e.file.name + " larger than 6Mb", 'Error');
            setTimeout(function () { e.request.abort(); }, 200);
        }
        
    }

  

    /**
     * event fired after image uploaded successfully
     * @param e
     */
    onUploaded(e) {


        $(".dx-fileuploader").find(".dx-fileuploader-files-container ").hide();

        //update the data source for photo data source object
        if (this.fileDataSource != null) {

            var fileNameWithoutExt = e.file.name;
            var fileExtension = '';
            if (e.file.name.indexOf(".") > 0) {
                fileNameWithoutExt = e.file.name.split('.').slice(0, -1).join('.')

                var re = /(?:\.([^.]+))?$/;

                fileExtension = re.exec(e.file.name)[1];
            }

            var response = JSON.parse(e.request.response);
            var fileName = response.result;

            
            //if (this.updateMode) {
            //    if (this.fileDataSource != null && this.fileDataSource != undefined
            //        && this.fileDataSource.length > 0) {
            //        this.fileTitle = this.fileDataSource[0].title;
            //    }                
            //}

            this.fileDataSource = [];
            var title = this.fileTitle == '' ? fileNameWithoutExt : this.fileTitle;


            this.fileDataSource.push({
                "id": 0,
                "applicationId": 0,
                "title": title,
                "description": title,
                "fileName": fileNameWithoutExt,                
                "orginalFileName": fileName,                              
                "fileSize": Math.round(e.file.size / 1024),
                "fileExtension": fileExtension,
                "formatDate": '',
                "mimeType": e.file.type == '' ? 'undefined' : e.file.type,
                "documentCategoryId": 0,
                "documentCategoryName": ''
                //"mimeType": e.file.type == '' ? 'undefined' : e.file.type,
                //"lastModifiedDate": e.file.lastModifiedDate,                
                //
                //"Version": 1,
                //"createdBy": "",
                //"isDirty": true
            });
        }
    }

    /**
     * init event
     * */
    ngOnInit(): void {

        this.loanService.getApplicationLoanDocumentCategory(this.applicationId).subscribe(data => {
            this.documentCategorySelectItem = data.result;
        });


    }
   

    /**
     * click on remove button
     * @param e
     */
    onRemoveClicked(e) {
        if (this.updateMode) {
            this.fileTitle = e.title;
        }
        var index = this.fileDataSource.indexOf(e);
        this.fileDataSource.splice(index, 1);
    }
}

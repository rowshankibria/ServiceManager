import { Component, AfterViewInit, ViewChild, Inject, Input, AfterContentChecked } from '@angular/core';
import {
    DxButtonModule, DxSelectBoxModule, DxFormModule, DxTextBoxModule, DxTextAreaComponent, DxValidatorModule,
    DxValidationGroupComponent, DxFileUploaderComponent, DxValidatorComponent
} from 'devextreme-angular';

import { MessageService } from './../../../shared/services/message.service'
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { DmsService } from './../services/dms.service';
declare var $: any;

@Component({
    selector: 'dms-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
})

export class FileUploadComponent implements AfterContentChecked {



    fileList: any = [];
    fileDataSource: any = [];

    fileTitle: string = '';

    @Input("AllowMultipleFilesSelection") allowMultipleFilesSelection: boolean = true;
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

     

    uploadUrl: any;

    @ViewChild('fileUpload')
    private fileUpload: DxFileUploaderComponent;

    /**
     * 
     * @param messageService
     */
    constructor(private dmsService: DmsService, private messageService: MessageService, private apiHttpService: ApiHttpService) {

        this.uploadUrl = apiHttpService.getApiUrl('dms/document/upload-file');


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
        //if (this.getFileDataSource.length > 0) {
        //    this.fileTitle = fileDataSource[0].title;
        //}
    }

    setFileDataSourceByEntity(entityTypeId: number, entityId: number) : void
    {
        this.entityTypeId = entityTypeId;
        this.entityId = entityId;

        if (this.entityId > 0 && this.entityTypeId > 0) {
            this.dmsService.getDocumentsByEntity(this.entityTypeId, this.entityId).toPromise().then((response: any) => {
                this.fileDataSource = response.result.files;
            });
        }
        
    }

    //
    saveEntityFiles(entityTypeId: number, entityId: number)
    {
        this.entityTypeId = entityTypeId;
        this.entityId = entityId;

        if (this.entityId > 0 && this.entityTypeId > 0) {
            this.dmsService.saveDocumentsByEntity(this.entityTypeId, this.entityId, this.fileDataSource).toPromise().then((response: any) =>
            {
                this.setFileDataSourceByEntity(this.entityTypeId, this.entityId);
            });
        }
        else {
            this.messageService.error("Please set entity type id and entity id","Error");
        }
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

            
            if (this.updateMode) {
                if (this.fileDataSource != null && this.fileDataSource != undefined
                    && this.fileDataSource.length > 0) {
                    this.fileTitle = this.fileDataSource[0].title;
                }

                this.fileDataSource = [];
            }

            var title = this.fileTitle == '' ? fileNameWithoutExt : this.fileTitle;


            this.fileDataSource.push({
                "id": 0, "fileName": fileNameWithoutExt, "title": title, "orginalFileName": fileName,
                "mimeType": e.file.type == '' ? 'undefined' : e.file.type, "fileSizeInKb": Math.round(e.file.size/1024), "lastModifiedDate": e.file.lastModifiedDate,
                "description": "", "extension": fileExtension, "Version": 1, "createdBy": "", "isDirty": true
            });
        }
    }

    /**
     * init event
     * */
    ngOnInit(): void {

    }

    setDirty(item: any) {
        item.isDirty = true;
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

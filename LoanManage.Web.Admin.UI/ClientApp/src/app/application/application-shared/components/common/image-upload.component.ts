import { Component, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { DxFileUploaderComponent } from 'devextreme-angular';
import { MessageService } from './../../../../shared/services/message.service'
import { ApiHttpService } from './../../../../shared/services/api-http.service'
declare var $: any;

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss'],
})

export class ImageUploadComponent {


    fileName: string = "";
    sourceUrl: any;
    downloadUrl: any = "";
    uploadUrl: any;
    emptyImageUrl = "../../../../../assets/img/no-image.png";
    photoDataSource: any = [];    
    hideClass: string = "img-fluid mx-auto d-block hide-remove-button";
    showClass: string = "img-fluid mx-auto d-block show-remove-button";
    removButtonClass: string = this.showClass;

    @ViewChild('uploadFile')
    private fileUpload: DxFileUploaderComponent;
   
    /**
     * 
     * @param messageService
     */
    constructor(private messageService: MessageService, private apiHttpService: ApiHttpService) {
        this.uploadUrl = apiHttpService.getApiUrl('shared/file-upload/upload-photo');
        this.sourceUrl = apiHttpService.getRootUrl('images/');
    }

    /**
     * set entity values
     * @param photo
     */
    setEntityValue(photoSource: any) {        
        this.photoDataSource = photoSource;
        if (this.photoDataSource.photoThumbnail != null && this.photoDataSource.photoThumbnail != "") {
            this.downloadUrl = "data:image/jpg;base64," + this.photoDataSource.photoThumbnail;
            this.photoDataSource.isDeleted = false;
            this.photoDataSource.photoThumbnail = null;
            
        }
        else {
            this.removButtonClass = this.hideClass;
            this.downloadUrl = this.emptyImageUrl;
        }
    }

    /**
     * on image changed event
     * @param e
     */
    //onValueChanged(e) {                
    //    if (e.value != null) {            
    //        var objValue = e.value[0];
    //        if (objValue != undefined) {

    //            //get file extensions
    //            var fileExtension = objValue.name.substr(objValue.name.lastIndexOf('.') + 1);
    //            //if .jpg file then allow other operation
    //            if (fileExtension == "jpg" || fileExtension == "png") {
    //                var fileSize = e.value[0].size;
    //                //6000000 bytes means approximately 6mb
    //                if (fileSize > 6000000) {
    //                    this.messageService.warning("File size larger than 6Mb", 'Warning');
    //                    this.fileUpload.visible = false;
    //                    e.value[0] = [];
    //                    $(".dx-fileuploader").find(".dx-fileuploader-files-container .dx-fileuploader-cancel-button").trigger("dxclick");
    //                }
    //                else {
    //                    this.fileUpload.visible = true;
    //                    this.removButtonClass = this.hideClass;
    //                }
    //            }
    //            else {
    //                this.messageService.warning("Please verify the format of the file. Allowed file format is .jpg and .png", 'Warning');
    //                this.fileUpload.visible = false;
    //                $(".dx-fileuploader").find(".dx-fileuploader-files-container .dx-fileuploader-cancel-button").trigger("dxclick");
    //            }
    //        }
    //        else {

    //            if (this.photoDataSource != null) {
    //                if (this.photoDataSource.photoThumbnail != null) {
    //                    this.removButtonClass = this.showClass;
    //                }
    //            }
    //        }
    //    }
    //}

    /**
 * DxFileUploader-onUploadStarted event
 * @param e
 */
    onUploadStarted(e) {
         
        //get file extensions
        var fileExtension = e.file.name.substr(e.file.name.lastIndexOf('.') + 1);
        //if .jpg file then allow other operation
        if (fileExtension == "jpg") {
            var fileSize = e.file.size;
            //6000000 bytes means approximately 6mb
            if (fileSize > 6000000) {
                this.messageService.error("File size larger than 6Mb", 'Error');
                this.fileUpload.visible = false;
                setTimeout(function () { e.request.abort(); }, 100);
                //$(".dx-fileuploader").find(".dx-fileuploader-files-container .dx-fileuploader-cancel-button").trigger("dxclick");
            }
            else {
                this.fileUpload.visible = true;
                this.removButtonClass = this.hideClass;
            }
        }
        else {
            this.messageService.error("Please verify the format of the file. Allowed file format is .jpg", 'Error');
            setTimeout(function () { e.request.abort(); }, 100);
            this.fileUpload.visible = false;
            //$(".dx-fileuploader").find(".dx-fileuploader-files-container .dx-fileuploader-cancel-button").trigger("dxclick");
        }


    }


    /**
     * event fired after image uploaded successfully
     * @param e
     */
    onUploaded(e) {

        var response = JSON.parse(e.request.response);
        var fileName = response.result;

        this.downloadUrl = this.sourceUrl + fileName; //e.file.name;
        this.fileUpload.visible = false;
        this.removButtonClass = this.showClass;

        //update the data source for photo data source object
        if (this.photoDataSource != null) {
            this.photoDataSource.uploadedFileName = fileName;
            this.photoDataSource.isDeleted = false;
            this.photoDataSource.isUpdated = true;
        }
    }

    /**
     * init event
     * */
    ngOnInit(): void {        
        this.downloadUrl = this.emptyImageUrl;
    }

    /**
     * on click event. this event fire when we click on image to upload new image
     * @param e
     */
    onClick(e) {        
        $(".dx-fileuploader").find(".dx-fileuploader-button").trigger('click');
    }

    /**
     * click on remove button
     * @param e
     */
    onRemoveClick(e) {
        
        if (this.photoDataSource != null) {
            this.photoDataSource.photoThumbnail = null;
            this.photoDataSource.isDeleted = true;
            this.photoDataSource.isUpdated = false;
        }

        this.downloadUrl = this.emptyImageUrl;
        this.removButtonClass = this.hideClass;
        
    }
}

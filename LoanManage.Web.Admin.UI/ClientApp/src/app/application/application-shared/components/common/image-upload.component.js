"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ImageUploadComponent = /** @class */ (function () {
    /**
     *
     * @param messageService
     */
    function ImageUploadComponent(messageService, apiHttpService) {
        this.messageService = messageService;
        this.apiHttpService = apiHttpService;
        this.fileName = "";
        this.downloadUrl = "";
        this.emptyImageUrl = "../../../../../assets/img/no-image.png";
        this.photoDataSource = [];
        this.hideClass = "img-fluid mx-auto d-block hide-remove-button";
        this.showClass = "img-fluid mx-auto d-block show-remove-button";
        this.removButtonClass = this.showClass;
        this.uploadUrl = apiHttpService.getApiUrl('shared/file-upload/upload-photo');
        this.sourceUrl = apiHttpService.getRootUrl('images/');
    }
    /**
     * set entity values
     * @param photo
     */
    ImageUploadComponent.prototype.setEntityValue = function (photoSource) {
        this.photoDataSource = photoSource;
        if (this.photoDataSource.photoThumbnail != null && this.photoDataSource.photoThumbnail != "") {
            this.downloadUrl = "data:image/jpg;base64," + this.photoDataSource.photoThumbnail;
            this.photoDataSource.isDeleted = false;
            this.photoDataSource.photoThumbnail = null;
        }
        else {
            this.removButtonClass = this.hideClass;
        }
    };
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
    ImageUploadComponent.prototype.onUploadStarted = function (e) {
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
    };
    /**
     * event fired after image uploaded successfully
     * @param e
     */
    ImageUploadComponent.prototype.onUploaded = function (e) {
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
    };
    /**
     * init event
     * */
    ImageUploadComponent.prototype.ngOnInit = function () {
        this.downloadUrl = this.emptyImageUrl;
    };
    /**
     * on click event. this event fire when we click on image to upload new image
     * @param e
     */
    ImageUploadComponent.prototype.onClick = function (e) {
        $(".dx-fileuploader").find(".dx-fileuploader-button").trigger('click');
    };
    /**
     * click on remove button
     * @param e
     */
    ImageUploadComponent.prototype.onRemoveClick = function (e) {
        if (this.photoDataSource != null) {
            this.photoDataSource.photoThumbnail = null;
            this.photoDataSource.isDeleted = true;
            this.photoDataSource.isUpdated = false;
        }
        this.downloadUrl = this.emptyImageUrl;
        this.removButtonClass = this.hideClass;
    };
    __decorate([
        core_1.ViewChild('uploadFile')
    ], ImageUploadComponent.prototype, "fileUpload", void 0);
    ImageUploadComponent = __decorate([
        core_1.Component({
            selector: 'app-image-upload',
            templateUrl: './image-upload.component.html',
            styleUrls: ['./image-upload.component.scss'],
        })
    ], ImageUploadComponent);
    return ImageUploadComponent;
}());
exports.ImageUploadComponent = ImageUploadComponent;
//# sourceMappingURL=image-upload.component.js.map
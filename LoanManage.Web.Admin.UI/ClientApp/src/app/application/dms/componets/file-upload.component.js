"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FileUploadComponent = /** @class */ (function () {
    /**
     *
     * @param messageService
     */
    function FileUploadComponent(dmsService, messageService, apiHttpService) {
        this.dmsService = dmsService;
        this.messageService = messageService;
        this.apiHttpService = apiHttpService;
        this.fileList = [];
        this.fileDataSource = [];
        this.fileTitle = '';
        this.allowMultipleFilesSelection = true;
        this.entityTypeId = 0;
        this.entityId = 0;
        this._updateMode = false;
        this.uploadUrl = apiHttpService.getApiUrl('dms/document/upload-file');
    }
    Object.defineProperty(FileUploadComponent.prototype, "updateMode", {
        get: function () {
            return this._updateMode;
        },
        set: function (value) {
            this._updateMode = value;
            if (value) {
                this.allowMultipleFilesSelection = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    FileUploadComponent.prototype.ngAfterContentChecked = function () {
        $('.dx-fileuploader-files-container').hide();
    };
    /**
     * set entity values
     * @param photo
     */
    FileUploadComponent.prototype.setFileDataSource = function (fileDataSource) {
        this.fileDataSource = fileDataSource;
        //if (this.getFileDataSource.length > 0) {
        //    this.fileTitle = fileDataSource[0].title;
        //}
    };
    FileUploadComponent.prototype.setFileDataSourceByEntity = function (entityTypeId, entityId) {
        var _this = this;
        this.entityTypeId = entityTypeId;
        this.entityId = entityId;
        if (this.entityId > 0 && this.entityTypeId > 0) {
            this.dmsService.getDocumentsByEntity(this.entityTypeId, this.entityId).toPromise().then(function (response) {
                _this.fileDataSource = response.result.files;
            });
        }
    };
    //
    FileUploadComponent.prototype.saveEntityFiles = function (entityTypeId, entityId) {
        var _this = this;
        this.entityTypeId = entityTypeId;
        this.entityId = entityId;
        if (this.entityId > 0 && this.entityTypeId > 0) {
            this.dmsService.saveDocumentsByEntity(this.entityTypeId, this.entityId, this.fileDataSource).toPromise().then(function (response) {
                _this.setFileDataSourceByEntity(_this.entityTypeId, _this.entityId);
            });
        }
        else {
            this.messageService.error("Please set entity type id and entity id", "Error");
        }
    };
    /**
     * set entity values
     * @param photo
     */
    FileUploadComponent.prototype.getFileDataSource = function () {
        return this.fileDataSource;
    };
    /**
     * DxFileUploader-onUploadStarted event
     * @param e
     */
    FileUploadComponent.prototype.onUploadStarted = function (e) {
        if (e.file.size > 6000000) {
            this.messageService.error("File: " + e.file.name + " larger than 6Mb", 'Error');
            setTimeout(function () { e.request.abort(); }, 200);
        }
    };
    /**
     * event fired after image uploaded successfully
     * @param e
     */
    FileUploadComponent.prototype.onUploaded = function (e) {
        $(".dx-fileuploader").find(".dx-fileuploader-files-container ").hide();
        //update the data source for photo data source object
        if (this.fileDataSource != null) {
            var fileNameWithoutExt = e.file.name;
            var fileExtension = '';
            if (e.file.name.indexOf(".") > 0) {
                fileNameWithoutExt = e.file.name.split('.').slice(0, -1).join('.');
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
                "mimeType": e.file.type == '' ? 'undefined' : e.file.type, "fileSizeInKb": Math.round(e.file.size / 1024), "lastModifiedDate": e.file.lastModifiedDate,
                "description": "", "extension": fileExtension, "Version": 1, "createdBy": "", "isDirty": true
            });
        }
    };
    /**
     * init event
     * */
    FileUploadComponent.prototype.ngOnInit = function () {
    };
    FileUploadComponent.prototype.setDirty = function (item) {
        item.isDirty = true;
    };
    /**
     * click on remove button
     * @param e
     */
    FileUploadComponent.prototype.onRemoveClicked = function (e) {
        if (this.updateMode) {
            this.fileTitle = e.title;
        }
        var index = this.fileDataSource.indexOf(e);
        this.fileDataSource.splice(index, 1);
    };
    __decorate([
        core_1.Input("AllowMultipleFilesSelection")
    ], FileUploadComponent.prototype, "allowMultipleFilesSelection", void 0);
    __decorate([
        core_1.Input("UpdateMode")
    ], FileUploadComponent.prototype, "updateMode", null);
    __decorate([
        core_1.ViewChild('fileUpload')
    ], FileUploadComponent.prototype, "fileUpload", void 0);
    FileUploadComponent = __decorate([
        core_1.Component({
            selector: 'dms-file-upload',
            templateUrl: './file-upload.component.html',
            styleUrls: ['./file-upload.component.scss'],
        })
    ], FileUploadComponent);
    return FileUploadComponent;
}());
exports.FileUploadComponent = FileUploadComponent;
//# sourceMappingURL=file-upload.component.js.map
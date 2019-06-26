"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FileUploaderComponent = /** @class */ (function () {
    /**
     *
     * @param messageService
     */
    function FileUploaderComponent(loanService, messageService, apiHttpService, route, router) {
        var _this = this;
        this.loanService = loanService;
        this.messageService = messageService;
        this.apiHttpService = apiHttpService;
        this.route = route;
        this.router = router;
        this.fileList = [];
        this.fileDataSource = [];
        this.documentCategorySelectItem = [];
        this.fileTitle = '';
        this.applicationId = 0;
        this.allowMultipleFilesSelection = false;
        this.entityTypeId = 0;
        this.entityId = 0;
        this._updateMode = false;
        this.uploadUrl = apiHttpService.getApiUrl('shared/file-upload/upload-file');
        this.route.params.subscribe(function (params) {
            if (params['applicationId'] !== undefined) {
                _this.applicationId = params['applicationId'];
            }
        });
    }
    Object.defineProperty(FileUploaderComponent.prototype, "updateMode", {
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
    FileUploaderComponent.prototype.ngAfterContentChecked = function () {
        $('.dx-fileuploader-files-container').hide();
    };
    /**
     * set entity values
     * @param photo
     */
    FileUploaderComponent.prototype.setFileDataSource = function (fileDataSource) {
        this.fileDataSource = fileDataSource;
    };
    /**
     * set entity values
     * @param photo
     */
    FileUploaderComponent.prototype.getFileDataSource = function () {
        return this.fileDataSource;
    };
    /**
     * DxFileUploader-onUploadStarted event
     * @param e
     */
    FileUploaderComponent.prototype.onUploadStarted = function (e) {
        if (e.file.size > 6000000) {
            this.messageService.error("File: " + e.file.name + " larger than 6Mb", 'Error');
            setTimeout(function () { e.request.abort(); }, 200);
        }
    };
    /**
     * event fired after image uploaded successfully
     * @param e
     */
    FileUploaderComponent.prototype.onUploaded = function (e) {
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
    };
    /**
     * init event
     * */
    FileUploaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loanService.getApplicationLoanDocumentCategory(this.applicationId).subscribe(function (data) {
            _this.documentCategorySelectItem = data.result;
        });
    };
    /**
     * click on remove button
     * @param e
     */
    FileUploaderComponent.prototype.onRemoveClicked = function (e) {
        if (this.updateMode) {
            this.fileTitle = e.title;
        }
        var index = this.fileDataSource.indexOf(e);
        this.fileDataSource.splice(index, 1);
    };
    __decorate([
        core_1.Input("AllowMultipleFilesSelection")
    ], FileUploaderComponent.prototype, "allowMultipleFilesSelection", void 0);
    __decorate([
        core_1.Input("UpdateMode")
    ], FileUploaderComponent.prototype, "updateMode", null);
    __decorate([
        core_1.ViewChild('fileUpload')
    ], FileUploaderComponent.prototype, "fileUpload", void 0);
    FileUploaderComponent = __decorate([
        core_1.Component({
            selector: 'file-uploader',
            templateUrl: './fileuploader.component.html',
            styleUrls: ['./fileuploader.component.scss'],
        })
    ], FileUploaderComponent);
    return FileUploaderComponent;
}());
exports.FileUploaderComponent = FileUploaderComponent;
//# sourceMappingURL=fileuploader.component.js.map
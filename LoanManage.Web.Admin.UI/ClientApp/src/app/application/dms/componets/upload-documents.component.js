"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var message_service_1 = require("./../../../shared/services/message.service");
var titlebar_component_1 = require("./../../application-shared/components/titlebar/titlebar.component");
var utilities_1 = require("./../../application-shared/components/titlebar/utilities");
var app_entity_select_box_component_1 = require("./../../application-shared/components/common/app-entity-select-box.component");
var UploadDocumentsComponent = /** @class */ (function () {
    function UploadDocumentsComponent(dmsService, messageService, navigationService, apiHttpService, route, router) {
        //this.uploadUrl = apiHttpService.getApiUrl('shared/file-upload/upload-photo');
        //this.sourceUrl = apiHttpService.getRootUrl('images/');
        var _this = this;
        this.dmsService = dmsService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.apiHttpService = apiHttpService;
        this.route = route;
        this.router = router;
        this.documentId = 0;
        this.documentDataSource = [];
        this.documentTypeDataSource = [];
        this.documentForDataSource = [];
        this.businessProfileDataSource = [];
        this.fileDataSource = [];
        this.fileRevisionsDataSource = [];
        this.documentTypeFilterDataSource = [];
        this.isDisabledBusinessProfile = false;
        this.entityClass = "row form-group";
        this.hideEntityClass = "row form-group item-invisible";
        this.showEntityClass = "row form-group";
        this.contentClass = "detail-page-content-div";
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.route.params.subscribe(function (params) {
            if (params['documentId'] != undefined) {
                _this.documentId = params['documentId'];
            }
        });
    }
    UploadDocumentsComponent.prototype.ngOnInit = function () {
        this.setDataSource();
        this.attachValidationToControl();
        //this.businessProfileValidation.validationRules = [{ type: 'required', message: 'Business Profile is required.' }];
    };
    UploadDocumentsComponent.prototype.attachValidationToControl = function () {
        //validation   
        this.businessProfileValidation.validationRules = [{ type: 'required', message: 'Business Profile is required.' }];
        this.documentForSelectionBoxValidation.validationRules = [{ type: 'required', message: 'Document For is invalid' }];
    };
    UploadDocumentsComponent.prototype.ngAfterViewInit = function () {
        this.titlebar.initializeToolbar("", null, this.toolbarType);
        if (this.toolbarType == utilities_1.ToolbarType.DetailTabPage) {
            this.contentClass = "detail-page-content-div-tab";
        }
    };
    /**
* Data source binding
* */
    UploadDocumentsComponent.prototype.setDataSource = function () {
        var _this = this;
        this.dmsService.getDocument(this.documentId).toPromise().then(function (response) {
            _this.isDisabledBusinessProfile = !response.result.isDefaultBusinessProfile;
            _this.documentTypeDataSource = response.result.documentTypeSelectItems;
            _this.documentForDataSource = response.result.documentForSelectItems;
            _this.businessProfileDataSource = response.result.businessProfileSelectItems;
            _this.fileDataSource = response.result.documentMetadata.files;
            _this.fileRevisionsDataSource = response.result.documentMetadata.revisions;
            _this.documentDataSource = response.result.documentMetadata;
            _this.fileUploadControl.setFileDataSource(_this.fileDataSource);
            if (_this.documentId > 0) {
                _this.isDisabledBusinessProfile = true;
                _this.fileUploadControl.updateMode = true;
                _this.documentEntitySelectionBox.setValue(response.result.documentMetadata.entityId);
            }
            _this.titlebar.setToolbarTitle(_this.documentId == 0 ? "Upload Document: New" : "Document: " + _this.documentDataSource.title);
        });
    };
    UploadDocumentsComponent.prototype.saveEntity = function (action) {
        var _this = this;
        if (this.fileUploadControl.getFileDataSource().length == 0) {
            this.messageService.warning(message_service_1.AppMessage.InvalidDocuemtUpload, "Information");
            return;
        }
        this.documentDataSource.entityId = this.documentEntitySelectionBox.getValue();
        this.documentDataSource.files = this.fileUploadControl.getFileDataSource();
        if (this.documentId == 0 || this.documentId == null || this.documentId == undefined) {
            this.dmsService.saveDocuments(this.documentDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been save successfully", 'Information');
                _this.redirectToListPage(action);
            });
        }
        else {
            this.dmsService.updateDocument(this.documentId, this.documentDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been save successfully", 'Information');
                _this.redirectToListPage(action);
            });
        }
    };
    /**
 * validate and save data
 */
    UploadDocumentsComponent.prototype.validateAndSave = function (action) {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    };
    /**
 * on save and close button clicked
 */
    UploadDocumentsComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    UploadDocumentsComponent.prototype.onCloseClicked = function () {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    /**
 * On value changed
 **/
    UploadDocumentsComponent.prototype.onDocumentForValueChanged = function (e) {
        this.entityClass = this.hideEntityClass;
        if (this.documentDataSource.businessProfileId > 0 && this.documentDataSource.entityTypeId) {
            this.entityClass = this.showEntityClass;
            this.documentEntitySelectionBox.setEntityDataSource(this.documentDataSource.entityTypeId, this.documentDataSource.businessProfileId);
        }
    };
    UploadDocumentsComponent.prototype.onBusinessProfileValueChanged = function (e) {
        var _this = this;
        this.documentTypeFilterDataSource = this.documentTypeDataSource.filter(function (x) { return x.businessProfileId == null || x.businessProfileId == _this.documentDataSource.businessProfileId; });
        this.onDocumentForValueChanged(e);
    };
    /**
* redirect to list page
*/
    UploadDocumentsComponent.prototype.redirectToListPage = function (action) {
        var newNavigationUrl = '/dms/document/upload';
        if (action == utilities_1.DetailPageAction.Close || action == utilities_1.DetailPageAction.SaveAndClose) {
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
    };
    UploadDocumentsComponent.prototype.onDownloadClick = function (file) {
        //alert(JSON.stringify(file));
        var fileName = file.fileName + file.extension;
        this.dmsService.downloadFile(file.id, fileName);
    };
    __decorate([
        core_1.Input()
    ], UploadDocumentsComponent.prototype, "documentId", void 0);
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], UploadDocumentsComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild(app_entity_select_box_component_1.EntitySelectBoxComponent)
    ], UploadDocumentsComponent.prototype, "documentEntitySelectionBox", void 0);
    __decorate([
        core_1.ViewChild('formValidation')
    ], UploadDocumentsComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.ViewChild('fileUploadControl')
    ], UploadDocumentsComponent.prototype, "fileUploadControl", void 0);
    __decorate([
        core_1.ViewChild('businessProfileValidation')
    ], UploadDocumentsComponent.prototype, "businessProfileValidation", void 0);
    __decorate([
        core_1.ViewChild('documentForSelectionBoxValidation')
    ], UploadDocumentsComponent.prototype, "documentForSelectionBoxValidation", void 0);
    UploadDocumentsComponent = __decorate([
        core_1.Component({
            selector: 'dms-upload-documents',
            templateUrl: './upload-documents.component.html',
            styleUrls: ['./upload-documents.component.scss'],
        })
    ], UploadDocumentsComponent);
    return UploadDocumentsComponent;
}());
exports.UploadDocumentsComponent = UploadDocumentsComponent;
//# sourceMappingURL=upload-documents.component.js.map
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
var FileUploaderFormComponent = /** @class */ (function () {
    /**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    function FileUploaderFormComponent(loanService, messageService, navigationService, route, router) {
        var _this = this;
        this.loanService = loanService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.applicationDocumentList = [];
        this.loanApplicationModel = [];
        this.applicationId = 0;
        this.loanStatusMapTypeId = 0;
        this.disableItem = false;
        this.entityTitle = "Document";
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.route.params.subscribe(function (params) {
            if (params['applicationId'] !== undefined) {
                _this.applicationId = params['applicationId'];
                _this.toolbarType = utilities_1.ToolbarType.DetailPage;
            }
        });
    }
    FileUploaderFormComponent.prototype.ngOnInit = function () {
        //if(this.applicationId > 0)
        //    this.addToolbarAdditionalItems();
        this.init();
    };
    FileUploaderFormComponent.prototype.ngAfterViewInit = function () {
    };
    FileUploaderFormComponent.prototype.ngAfterViewChecked = function () {
        // ...
    };
    /************************************************ Method Start *********************************** */
    /**
     * Init method
     **/
    FileUploaderFormComponent.prototype.init = function () {
        var _this = this;
        this.loanService.getApplicationDocumentList(this.applicationId).subscribe(function (data) {
            _this.applicationDocumentList = data.result,
                _this.titlebar.initializeToolbar("Documents", null, _this.toolbarType, _this.disableItem);
        });
    };
    FileUploaderFormComponent.prototype.onDownloadClicked = function (id, fileName) {
        this.loanService.downloadLatestFile(id, fileName);
    };
    /*****************************  Credit Officer Start ******************************** */
    FileUploaderFormComponent.prototype.validateAndSave = function (action) {
        this.saveEntity(action);
    };
    FileUploaderFormComponent.prototype.saveEntity = function (action) {
        var _this = this;
        if (this.fileUploadControl.getFileDataSource().length == 0) {
            this.messageService.warning(message_service_1.AppMessage.InvalidDocuemtUpload, "Information");
            return;
        }
        this.loanService.uploadDocumentList(this.applicationId, this.fileUploadControl.getFileDataSource()).subscribe(function (data) {
            _this.messageService.success("Record has been saved successfully", 'Information');
            _this.fileUploadControl.fileDataSource = [];
            _this.init();
        });
    };
    FileUploaderFormComponent.prototype.redirectToListPage = function (action) {
        //debugger;
        var newNavigationUrl = '/loan/applications';
        if (action == utilities_1.DetailPageAction.Close || action == utilities_1.DetailPageAction.SaveAndClose) {
            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.applicationId, this.router.url);
        }
    };
    FileUploaderFormComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    FileUploaderFormComponent.prototype.onSaveNNewClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    FileUploaderFormComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    FileUploaderFormComponent.prototype.onCloseClicked = function (e) {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    FileUploaderFormComponent.prototype.onDeleteDocument = function (data) {
        var _this = this;
        this.loanService.deleteDocumentRecord(data).subscribe(function (data) {
            _this.messageService.success("Record has been deleted successfully", 'Information');
            _this.init();
        });
    };
    __decorate([
        core_1.ViewChild('formValidation')
    ], FileUploaderFormComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], FileUploaderFormComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild('fileUploadControl')
    ], FileUploaderFormComponent.prototype, "fileUploadControl", void 0);
    FileUploaderFormComponent = __decorate([
        core_1.Component({
            selector: 'app-fileuploader-form',
            templateUrl: './fileuploader-form.component.html',
            styleUrls: ['./fileuploader-form.component.scss'],
        })
    ], FileUploaderFormComponent);
    return FileUploaderFormComponent;
}());
exports.FileUploaderFormComponent = FileUploaderFormComponent;
//# sourceMappingURL=fileuploader-form.component.js.map
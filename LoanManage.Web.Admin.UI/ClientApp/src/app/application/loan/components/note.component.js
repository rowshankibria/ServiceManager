"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var titlebar_component_1 = require("./../../application-shared/components/titlebar/titlebar.component");
var utilities_1 = require("./../../application-shared/components/titlebar/utilities");
var utilities_2 = require("../../application-shared/components/titlebar/utilities");
var NoteComponent = /** @class */ (function () {
    /**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    function NoteComponent(loanService, messageService, navigationService, route, router) {
        var _this = this;
        this.loanService = loanService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.applicationNoteList = [];
        this.loanApplicationModel = [];
        this.applicationId = 0;
        this.loanStatusMapTypeId = 0;
        this.disableItem = false;
        this.assignedContactId = 0;
        this.loggedInUserContactId = 0;
        this.entityTitle = "Checklist";
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.route.params.subscribe(function (params) {
            if (params['applicationId'] !== undefined) {
                _this.applicationId = params['applicationId'];
                _this.toolbarType = utilities_1.ToolbarType.DetailPage;
            }
        });
    }
    NoteComponent.prototype.ngOnInit = function () {
        //if(this.applicationId > 0)
        //    this.addToolbarAdditionalItems();
        this.init();
    };
    NoteComponent.prototype.ngAfterViewInit = function () {
    };
    NoteComponent.prototype.ngAfterViewChecked = function () {
        // ...
    };
    /************************************************ Method Start *********************************** */
    /**
     * Init method
     **/
    NoteComponent.prototype.init = function () {
        var _this = this;
        this.loanService.getApplicationUserNoteList(this.applicationId).subscribe(function (data) {
            _this.applicationNoteList = data.result.noteList,
                _this.loanApplicationModel = data.result.loanApplicationModel,
                _this.setApprovalConfiguration(data.result.loanApplicationModel),
                _this.titlebar.initializeToolbar("User Note", null, _this.toolbarType, _this.disableItem);
        });
    };
    NoteComponent.prototype.setApprovalConfiguration = function (model) {
        if (this.applicationId > 0) {
            this.loanStatusMapTypeId = model.loanStatusMapTypeId;
            this.assignedContactId = model.AssignedContactId;
            this.loggedInUserContactId = model.LoginUserId;
            //if the loan is not started
            if (this.loanStatusMapTypeId == utilities_2.LoanStatusMapType.NotStarted) {
                this.disableItem = false;
            }
            else if (this.loanStatusMapTypeId == utilities_2.LoanStatusMapType.InProgress) {
                this.disableItem = false;
            }
            else if (this.loanStatusMapTypeId == utilities_2.LoanStatusMapType.Approved) {
                this.disableItem = true;
            }
            else if (this.loanStatusMapTypeId == utilities_2.LoanStatusMapType.Rejected) {
                this.disableItem = true;
            }
        }
    };
    /*****************************  Credit Officer Start ******************************** */
    NoteComponent.prototype.validateAndSave = function (action) {
        this.saveEntity(action);
    };
    NoteComponent.prototype.saveEntity = function (action) {
        var _this = this;
        this.loanService.updateUserNoteList(this.applicationNoteList).subscribe(function (data) {
            _this.messageService.success("Record has been saved successfully", 'Information');
            _this.init();
        });
    };
    NoteComponent.prototype.redirectToListPage = function (action) {
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
    NoteComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    NoteComponent.prototype.onSaveNNewClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    NoteComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    NoteComponent.prototype.onCloseClicked = function (e) {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    NoteComponent.prototype.onDeleteNote = function (data) {
        var _this = this;
        this.loanService.deleteNoteRecord(data).subscribe(function (data) {
            _this.messageService.success("Record has been deleted successfully", 'Information');
            _this.init();
        });
    };
    NoteComponent.prototype.addNewNote = function (e) {
        //debugger;
        var tempId = Math.floor(Math.random() * Math.floor(100000)) + Math.floor(Math.random() * Math.floor(1000000)) * -1;
        var spd = new NoteModel();
        spd.id = 0;
        spd.entityTypeId = 0;
        spd.entityId = this.applicationId;
        spd.noteDetail = '';
        spd.responseDetail = '';
        spd.isPrivate = false;
        spd.createdBy = '';
        spd.createdByContactId = 0;
        spd.noteTypeId = 0;
        spd.assignedByPhotoUrl = '';
        spd.assignedToPhotoUrl = '';
        spd.createdFor = '';
        spd.isAssignedToMe = false;
        this.applicationNoteList.push(spd);
    };
    __decorate([
        core_1.ViewChild('formValidation')
    ], NoteComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], NoteComponent.prototype, "titlebar", void 0);
    NoteComponent = __decorate([
        core_1.Component({
            selector: 'app-user-note',
            templateUrl: './note.component.html',
            styleUrls: ['./note.component.scss'],
        })
    ], NoteComponent);
    return NoteComponent;
}());
exports.NoteComponent = NoteComponent;
var NoteModel = /** @class */ (function () {
    function NoteModel() {
    }
    return NoteModel;
}());
exports.NoteModel = NoteModel;
//# sourceMappingURL=note.component.js.map
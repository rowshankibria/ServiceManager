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
var ChecklistComponent = /** @class */ (function () {
    /**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    function ChecklistComponent(loanService, messageService, navigationService, route, router) {
        var _this = this;
        this.loanService = loanService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.applicationChecklist = [];
        this.loanApplicationModel = [];
        this.approverGroupList = [];
        this.applicationId = 0;
        this.loanStatusMapTypeId = 0;
        this.approvalStatusId = 0;
        this.approverGroupTypeId = 0;
        this.currentApproverGroupTypeId = 0;
        this.disableItem = false;
        this.entityTitle = "Checklist";
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.route.params.subscribe(function (params) {
            if (params['applicationId'] !== undefined) {
                _this.applicationId = params['applicationId'];
                _this.toolbarType = utilities_1.ToolbarType.DetailPage;
            }
        });
    }
    ChecklistComponent.prototype.ngOnInit = function () {
        //if(this.applicationId > 0)
        //    this.addToolbarAdditionalItems();
        this.init();
    };
    ChecklistComponent.prototype.ngAfterViewInit = function () {
    };
    ChecklistComponent.prototype.ngAfterViewChecked = function () {
        // ...
    };
    /************************************************ Method Start *********************************** */
    /**
     * Init method
     **/
    ChecklistComponent.prototype.init = function () {
        var _this = this;
        this.loanService.getApplicationChecklist(this.applicationId).subscribe(function (data) {
            _this.applicationChecklist = data.result.applicationChecklist,
                _this.loanApplicationModel = data.result.loanApplicationModel,
                _this.approverGroupList = data.result.approverGroupList,
                _this.setApprovalConfiguration(data.result.loanApplicationModel),
                _this.titlebar.initializeToolbar("Checklist", null, _this.toolbarType, _this.disableItem);
        });
    };
    ChecklistComponent.prototype.setApprovalConfiguration = function (model) {
        if (this.applicationId > 0) {
            this.loanStatusMapTypeId = model.loanStatusMapTypeId;
            this.approvalStatusId = model.approvalStatusId;
            this.approverGroupTypeId = model.approverGroupTypeId;
            this.currentApproverGroupTypeId = model.currentApproverGroupTypeId;
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
            if (this.currentApproverGroupTypeId != this.approverGroupTypeId) {
                this.disableItem = true;
            }
        }
    };
    /*****************************  Credit Officer Start ******************************** */
    ChecklistComponent.prototype.validateAndSave = function (action) {
        this.saveEntity(action);
    };
    ChecklistComponent.prototype.saveEntity = function (action) {
        var _this = this;
        this.loanService.updateChecklist(this.applicationChecklist).subscribe(function (data) {
            _this.messageService.success("Record has been saved successfully", 'Information');
            _this.init();
        });
    };
    ChecklistComponent.prototype.redirectToListPage = function (action) {
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
    ChecklistComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    ChecklistComponent.prototype.onSaveNNewClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    ChecklistComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    ChecklistComponent.prototype.onCloseClicked = function (e) {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    __decorate([
        core_1.ViewChild('formValidation')
    ], ChecklistComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], ChecklistComponent.prototype, "titlebar", void 0);
    ChecklistComponent = __decorate([
        core_1.Component({
            selector: 'app-checklist',
            templateUrl: './checklist.component.html',
            styleUrls: ['./checklist.component.scss'],
        })
    ], ChecklistComponent);
    return ChecklistComponent;
}());
exports.ChecklistComponent = ChecklistComponent;
//# sourceMappingURL=checklist.component.js.map
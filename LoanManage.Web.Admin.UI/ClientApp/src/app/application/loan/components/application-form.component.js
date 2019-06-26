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
var entityModel_1 = require("../../system-service/models/entityModel");
var toolbar_item_1 = require("../../application-shared/components/titlebar/toolbar-item");
var utilities_2 = require("../../application-shared/components/titlebar/utilities");
var environment_1 = require("../../../../environments/environment");
var ApplicationDetailsComponent = /** @class */ (function () {
    /**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    function ApplicationDetailsComponent(loanService, messageService, navigationService, route, router) {
        var _this = this;
        this.loanService = loanService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.apiUrl = '';
        this.imageUrl = "../../../../../assets/img/no-image.png";
        this.disableItem = false;
        this.entityModel = new entityModel_1.EntityModel();
        this.contactDataSource = [];
        this.applicationDataSource = [];
        this.genderSelectItems = [];
        this.applicationStatusTypeSelectItems = [];
        this.branchSelectItems = [];
        this.loanTypeSelectItems = [];
        this.applicationCustomFields = [];
        this.temporaryDataSource = [];
        this.employeeSelectItems = [];
        this.currentAssigneeSelectItems = [];
        this.noteLogsCurrentAssignee = [];
        this.showGroup = "card mb-1 item-visible";
        this.hideGroup = "card mb-1 item-invisible";
        this.customFieldClassGroup = this.hideGroup;
        this.showInitialGroup = "row form-group item-visible";
        this.hideInitialGroup = "row form-group item-invisible";
        this.initialClassGroup = this.showInitialGroup;
        this.minDate = new Date(1900, 0, 1);
        this.nowDate = new Date();
        this.maxDate = new Date(this.nowDate.getFullYear() - 18, this.nowDate.getMonth(), this.nowDate.getDate());
        this.contentClass = "detail-page-content-div";
        this.applicationId = 0;
        this.entityTitle = "Application";
        this.loanTypeId = 0;
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.notStartedColor = "#FE7510";
        this.inProgressColor = "#AA17B0";
        this.acceptedColor = "#76b007";
        this.rejectedColor = "#FF0000";
        this.reviewColor = "#3F8BFA";
        this.approvalText = "Not Started";
        this.loanStatusMapTypeId = 0;
        this.approvalMappingId = 0;
        this.approvalStatusId = 0;
        this.approverGroupTypeId = 0;
        this.currentApproverGroupTypeId = 0;
        this.isCreditOperationNeeded = false;
        this.isRiskLegalNeeded = false;
        this.isSubmittedForCreditOperation = false;
        this.isSubmittedForRiskLegal = false;
        this.isClearedFromCreditOperation = false;
        this.isClearedFromRiskLegal = false;
        this.isSubmittedToCreditAdministrator = false;
        this.NotStarted = 18;
        this.InProgress = 19;
        this.Accepted = 21;
        this.Rejected = 22;
        this.route.params.subscribe(function (params) {
            if (params['applicationId'] !== undefined) {
                _this.applicationId = params['applicationId'];
                _this.toolbarType = utilities_1.ToolbarType.DetailPage;
                _this.contentClass = "detail-page-content-div";
            }
        });
        this.apiUrl = environment_1.environment.rootUrl;
        this.toolbarAdditionalItems = [];
    }
    ApplicationDetailsComponent.prototype.ngOnInit = function () {
        //if(this.applicationId > 0)
        //    this.addToolbarAdditionalItems();
        this.init();
    };
    ApplicationDetailsComponent.prototype.ngAfterViewInit = function () {
        //this.formValidation.instance.validate();
        this.addTagToApprovalConfiguration();
    };
    ApplicationDetailsComponent.prototype.addTagToApprovalConfiguration = function () {
        //if the loan is not started
        if (this.approvalStatusId == utilities_2.ApprovalStatusMapType.NotStarted) {
            this.approvalText = "Not Started";
            $(".ribbon span").css("background", "#FE7510");
        }
        else if (this.approvalStatusId == utilities_2.ApprovalStatusMapType.InProgress) {
            this.approvalText = "In Progress";
            $(".ribbon span").css("background", "#AA17B0");
        }
        else if (this.approvalStatusId == utilities_2.ApprovalStatusMapType.Review) {
            this.approvalText = "Review";
            $(".ribbon span").css("background", "#3F8BFA");
        }
        else if (this.approvalStatusId == utilities_2.ApprovalStatusMapType.Accepted) {
            this.approvalText = "Accepted";
            $(".ribbon span").css("background", "#76b007");
        }
        else if (this.approvalStatusId == utilities_2.ApprovalStatusMapType.Rejected) {
            this.approvalText = "Rejected";
            $(".ribbon span").css("background", "#FF0000");
        }
        else {
            this.approvalText = "Not Started";
            $(".ribbon span").css("background", "#FE7510");
        }
    };
    ApplicationDetailsComponent.prototype.ngAfterViewChecked = function () {
        // ...
        if (this.applicationId > 0) {
            //this.customFieldClassGroup = this.showGroup;
            //this.initialClassGroup = this.hideInitialGroup;
            $("#editDiv").show();
            $("#initDiv").hide();
        }
        else {
            $("#editDiv").hide();
            $("#initDiv").show();
        }
    };
    /************************************************ Method Start *********************************** */
    /**
     * Init method
     **/
    ApplicationDetailsComponent.prototype.init = function () {
        var _this = this;
        this.loanService.getApplication(this.applicationId).subscribe(function (data) {
            _this.genderSelectItems = data.result.genderSelectItems,
                _this.applicationStatusTypeSelectItems = data.result.applicationStatusTypeSelectItems,
                _this.branchSelectItems = data.result.branchSelectItems,
                _this.loanTypeSelectItems = data.result.loanTypeSelectItems,
                _this.employeeSelectItems = data.result.employeeSelectItems,
                _this.currentAssigneeSelectItems = data.result.currentAssigneeSelectItems,
                _this.noteLogsCurrentAssignee = data.result.noteLogsCurrentAssignee,
                _this.contactDataSource = data.result.loanApplicationModel.contact,
                _this.applicationDataSource = data.result.loanApplicationModel,
                _this.setApprovalConfiguration(data.result.loanApplicationModel),
                _this.applicationCustomFields = data.result.loanApplicationModel.applicationCustomFields,
                _this.setToolbarConfiguration(data.result.loanApplicationModel);
            //this.titlebar.initializeToolbar(this.applicationId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.result.loanApplicationModel.applicationId, this.applicationId == 0 ? null : this.toolbarAdditionalItems, this.toolbarType, this.disableItem);
        });
    };
    ApplicationDetailsComponent.prototype.setToolbarConfiguration = function (data) {
        //debugger;
        if (data.loginUserId == data.currentAssignedEmployeeContactId) {
            //if it is in progress
            if (this.approvalStatusId > 0 && this.approvalStatusId == this.InProgress && this.approvalStatusId != this.NotStarted) {
                this.disableItem = false;
                this.titlebar.initializeToolbar(this.applicationId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.applicationId, this.applicationId == 0 ? null : this.toolbarAdditionalItems, this.toolbarType, false);
            }
            else {
                this.titlebar.initializeToolbar(this.applicationId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.applicationId, this.applicationId == 0 ? null : this.toolbarAdditionalItems, this.toolbarType, this.disableItem);
            }
        }
        else {
            if (this.approvalStatusId > 0 && this.approvalStatusId != this.Accepted && this.approvalStatusId != this.NotStarted) {
                //this.addAssigneeUpdateToolbarItems();
                this.titlebar.initializeToolbar(this.applicationId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.applicationId, this.applicationId == 0 ? null : this.toolbarAdditionalItems, this.toolbarType, this.disableItem);
            }
            else {
                this.titlebar.initializeToolbar(this.applicationId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.applicationId, this.applicationId == 0 ? null : this.toolbarAdditionalItems, this.toolbarType, this.disableItem);
            }
        }
    };
    //set approval configuration 
    ApplicationDetailsComponent.prototype.setApprovalConfiguration = function (model) {
        if (this.applicationId > 0) {
            this.loanStatusMapTypeId = model.loanStatusMapTypeId;
            this.approvalMappingId = model.approvalMappingId;
            this.approvalStatusId = model.approvalStatusId;
            this.approverGroupTypeId = model.approverGroupTypeId;
            this.currentApproverGroupTypeId = model.currentApproverGroupTypeId;
            this.isCreditOperationNeeded = model.isCreditOperationNeeded;
            this.isRiskLegalNeeded = model.isRiskLegalNeeded;
            this.isSubmittedForCreditOperation = model.isSubmittedForCreditOperation;
            this.isSubmittedForRiskLegal = model.isSubmittedForRiskLegal;
            this.isClearedFromCreditOperation = model.isClearedFromCreditOperation;
            this.isClearedFromRiskLegal = model.isClearedFromRiskLegal;
            this.isSubmittedToCreditAdministrator = model.isSubmittedToCreditAdministrator;
            //if the loan is not started
            if (this.loanStatusMapTypeId == utilities_2.LoanStatusMapType.NotStarted) {
                this.disableItem = false;
                this.addToolbarAdditionalItems();
                this.addTagToApprovalConfiguration();
            }
            else if (this.loanStatusMapTypeId == utilities_2.LoanStatusMapType.InProgress) {
                this.disableItem = true;
                this.addTagToApprovalConfiguration();
                if (this.approverGroupTypeId == utilities_2.ApproverGroupTypeMapType.CreditOfficer) {
                    //do nothing                    
                }
                else if (this.approverGroupTypeId == utilities_2.ApproverGroupTypeMapType.BranchManager) {
                    if (this.currentApproverGroupTypeId == this.approverGroupTypeId) {
                        //accepted or rejected toolbar 
                        this.addAcceptedAndRejectedToolbarItems();
                    }
                }
                else if (this.approverGroupTypeId == utilities_2.ApproverGroupTypeMapType.ClusterHead) {
                    if (this.currentApproverGroupTypeId == this.approverGroupTypeId) {
                        //accepted or rejected toolbar 
                        this.addAcceptedAndRejectedToolbarItems();
                    }
                }
                else if (this.approverGroupTypeId == utilities_2.ApproverGroupTypeMapType.CreditOperation) {
                    if (this.currentApproverGroupTypeId == this.approverGroupTypeId) {
                        //accepted or rejected toolbar
                        this.addAcceptedAndRejectedToolbarItems();
                    }
                }
                else if (this.approverGroupTypeId == utilities_2.ApproverGroupTypeMapType.Risk_LegalAndCompliance) {
                    if (this.currentApproverGroupTypeId == this.approverGroupTypeId) {
                        //accepted or rejected toolbar
                        this.addAcceptedAndRejectedToolbarItems();
                    }
                }
                else if (this.approverGroupTypeId == utilities_2.ApproverGroupTypeMapType.DCEO_DGM) {
                    if (this.currentApproverGroupTypeId == this.approverGroupTypeId) {
                        //accepted or rejected toolbar
                        this.addAcceptedAndRejectedToolbarItems();
                    }
                }
                else if (this.approverGroupTypeId == utilities_2.ApproverGroupTypeMapType.CEO) {
                    if (this.currentApproverGroupTypeId == this.approverGroupTypeId) {
                        //accepted or rejected toolbar
                        this.addAcceptedAndRejectedToolbarItems();
                    }
                }
            }
            else if (this.loanStatusMapTypeId == utilities_2.LoanStatusMapType.Approved) {
                this.disableItem = true;
                this.addTagToApprovalConfiguration();
                if (this.approverGroupTypeId == utilities_2.ApproverGroupTypeMapType.CreditOfficer) {
                    if (this.isSubmittedToCreditAdministrator == false) {
                        //add send to credit administrator toolbar
                        this.addSendToCreditAdministratorToolbarItems();
                    }
                }
            }
            else if (this.loanStatusMapTypeId == utilities_2.LoanStatusMapType.Rejected) {
                this.disableItem = true;
                this.addTagToApprovalConfiguration();
            }
        }
        else {
        }
    };
    /*****************************  Credit Officer Start ******************************** */
    ApplicationDetailsComponent.prototype.addToolbarAdditionalItems = function () {
        var _this = this;
        var sendToApprovalItem = new toolbar_item_1.ToolbarItem();
        sendToApprovalItem.location = 'after';
        sendToApprovalItem.widget = 'dxButton';
        sendToApprovalItem.locateInMenu = 'auto';
        sendToApprovalItem.visible = true;
        sendToApprovalItem.disabled = false;
        var sendToApprovalItemOption = new toolbar_item_1.ToolbarItemOption();
        sendToApprovalItemOption.icon = 'revert';
        sendToApprovalItemOption.text = 'Send To Approval';
        sendToApprovalItemOption.onClick = function () {
            _this.onMapToApprovalProcess();
        };
        sendToApprovalItem.options = sendToApprovalItemOption;
        this.toolbarAdditionalItems.push(sendToApprovalItem);
    };
    ApplicationDetailsComponent.prototype.onMapToApprovalProcess = function () {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        else {
            this.saveRecordBeforeSendToApproval();
        }
    };
    ApplicationDetailsComponent.prototype.saveRecordBeforeSendToApproval = function () {
        var _this = this;
        this.applicationDataSource.applicationCustomFields = this.temporaryDataSource;
        this.loanService.updateApplication("", this.applicationDataSource).subscribe(function (data) {
            _this.applicationId = data.result;
            _this.entityModel.entityId = data.result;
            _this.sendToApprovalAfterSavingRecord();
        });
    };
    ApplicationDetailsComponent.prototype.sendToApprovalAfterSavingRecord = function () {
        var _this = this;
        //var returnUrlWithId = "/loan/application/" + this.applicationId;       
        if (this.applicationId > 0) {
            this.loanService.mapApplicationToApprovalProcess(this.applicationDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been submitted for approval process successfully", 'Information');
                //this.init();
                window.location.reload();
            });
        }
    };
    /*****************************  Credit Officer End ******************************** */
    /*****************************  Branch Manager/DCEO/CEO Start ******************************** */
    ApplicationDetailsComponent.prototype.addAcceptedAndRejectedToolbarItems = function () {
        var _this = this;
        //Accepted
        var acceptedItem = new toolbar_item_1.ToolbarItem();
        acceptedItem.location = 'after';
        acceptedItem.widget = 'dxButton';
        acceptedItem.locateInMenu = 'auto';
        acceptedItem.visible = true;
        acceptedItem.disabled = false;
        var acceptedItemOption = new toolbar_item_1.ToolbarItemOption();
        acceptedItemOption.icon = 'check';
        acceptedItemOption.text = 'Accepted';
        acceptedItemOption.onClick = function () {
            _this.acceptApprovalProcess();
        };
        acceptedItem.options = acceptedItemOption;
        this.toolbarAdditionalItems.push(acceptedItem);
        //Rejected
        var rejectedItem = new toolbar_item_1.ToolbarItem();
        rejectedItem.location = 'after';
        rejectedItem.widget = 'dxButton';
        rejectedItem.locateInMenu = 'auto';
        rejectedItem.visible = true;
        rejectedItem.disabled = false;
        var rejectedItemOption = new toolbar_item_1.ToolbarItemOption();
        rejectedItemOption.icon = 'remove';
        rejectedItemOption.text = 'Rejected';
        rejectedItemOption.onClick = function () {
            _this.rejectApprovalProcess();
        };
        rejectedItem.options = rejectedItemOption;
        this.toolbarAdditionalItems.push(rejectedItem);
    };
    ApplicationDetailsComponent.prototype.acceptApprovalProcess = function () {
        var _this = this;
        if (this.applicationId > 0) {
            this.loanService.acceptApprovalProcess(this.applicationId, this.approvalMappingId).subscribe(function (data) {
                _this.messageService.success("Record has been approved successfully", 'Information');
                //this.init();
                window.location.reload();
            });
        }
    };
    ApplicationDetailsComponent.prototype.rejectApprovalProcess = function () {
        var _this = this;
        if (this.applicationId > 0) {
            this.loanService.rejectApprovalProcess(this.applicationId, this.approvalMappingId).subscribe(function (data) {
                _this.messageService.success("Record has been rejected successfully", 'Information');
                //this.init();
                window.location.reload();
            });
        }
    };
    ApplicationDetailsComponent.prototype.addSendToCreditAdministratorToolbarItems = function () {
        var _this = this;
        //Move Up
        var sendToCreditAdminItem = new toolbar_item_1.ToolbarItem();
        sendToCreditAdminItem.location = 'after';
        sendToCreditAdminItem.widget = 'dxButton';
        sendToCreditAdminItem.locateInMenu = 'auto';
        sendToCreditAdminItem.visible = true;
        sendToCreditAdminItem.disabled = false;
        var sendToCreditAdminItemOption = new toolbar_item_1.ToolbarItemOption();
        sendToCreditAdminItemOption.icon = 'revert';
        sendToCreditAdminItemOption.text = 'Send To Cr. Administrator';
        sendToCreditAdminItemOption.onClick = function () {
            _this.submitToCreditAdministrator();
        };
        sendToCreditAdminItem.options = sendToCreditAdminItemOption;
        this.toolbarAdditionalItems.push(sendToCreditAdminItem);
    };
    ApplicationDetailsComponent.prototype.submitToCreditAdministrator = function () {
        var _this = this;
        if (this.applicationId > 0) {
            this.loanService.submitToCreditAdministrator(this.applicationId).subscribe(function (data) {
                _this.messageService.success("Record has been submit to credit administrator successfully", 'Information');
                //this.init();
                window.location.reload();
            });
        }
    };
    ApplicationDetailsComponent.prototype.addAssigneeUpdateToolbarItems = function () {
        var _this = this;
        //
        var saveItem = new toolbar_item_1.ToolbarItem();
        saveItem.location = 'after';
        saveItem.widget = 'dxButton';
        saveItem.locateInMenu = 'auto';
        saveItem.visible = true;
        saveItem.disabled = false;
        var saveItemOption = new toolbar_item_1.ToolbarItemOption();
        saveItemOption.icon = 'save';
        saveItemOption.text = 'Save';
        saveItemOption.onClick = function () {
            _this.validateAndSave(utilities_1.DetailPageAction.Save);
        };
        saveItem.options = saveItemOption;
        this.toolbarAdditionalItems.push(saveItem);
    };
    /*****************************  Branch Manager/DCEO/CEO End ******************************** */
    /*****************************  Credit Operation & Compliance Start ******************************** */
    ApplicationDetailsComponent.prototype.addSubmitToCreditOperationToolbarItems = function () {
        //Move Up
        var creditOperationSubmitItem = new toolbar_item_1.ToolbarItem();
        creditOperationSubmitItem.location = 'after';
        creditOperationSubmitItem.widget = 'dxButton';
        creditOperationSubmitItem.locateInMenu = 'auto';
        creditOperationSubmitItem.visible = true;
        creditOperationSubmitItem.disabled = false;
        var creditOperationSubmitItemOption = new toolbar_item_1.ToolbarItemOption();
        creditOperationSubmitItemOption.icon = 'revert';
        creditOperationSubmitItemOption.text = 'Send To Cr. Operation';
        creditOperationSubmitItemOption.onClick = function () {
            //this.onMapToApprovalProcess();
        };
        creditOperationSubmitItem.options = creditOperationSubmitItemOption;
        this.toolbarAdditionalItems.push(creditOperationSubmitItem);
    };
    ApplicationDetailsComponent.prototype.addCreditOperationToolbar = function () {
        //add clear credit operation, reject button, and submit to legal button
        //Accepted
        var clearCreditOperationItem = new toolbar_item_1.ToolbarItem();
        clearCreditOperationItem.location = 'after';
        clearCreditOperationItem.widget = 'dxButton';
        clearCreditOperationItem.locateInMenu = 'auto';
        clearCreditOperationItem.visible = true;
        clearCreditOperationItem.disabled = false;
        var clearCreditOperationItemOption = new toolbar_item_1.ToolbarItemOption();
        clearCreditOperationItemOption.icon = 'check';
        clearCreditOperationItemOption.text = 'Accepted';
        clearCreditOperationItemOption.onClick = function () {
            //this.onMapToApprovalProcess();
        };
        clearCreditOperationItem.options = clearCreditOperationItemOption;
        this.toolbarAdditionalItems.push(clearCreditOperationItem);
        //Rejected
        var rejectedItem = new toolbar_item_1.ToolbarItem();
        rejectedItem.location = 'after';
        rejectedItem.widget = 'dxButton';
        rejectedItem.locateInMenu = 'auto';
        rejectedItem.visible = true;
        rejectedItem.disabled = false;
        var rejectedItemOption = new toolbar_item_1.ToolbarItemOption();
        rejectedItemOption.icon = 'remove';
        rejectedItemOption.text = 'Rejected';
        rejectedItemOption.onClick = function () {
            //this.onMapToApprovalProcess();
        };
        rejectedItem.options = rejectedItemOption;
        this.toolbarAdditionalItems.push(rejectedItem);
        //Submit to legal Administrator
        var legalItem = new toolbar_item_1.ToolbarItem();
        legalItem.location = 'after';
        legalItem.widget = 'dxButton';
        legalItem.locateInMenu = 'auto';
        legalItem.visible = true;
        legalItem.disabled = false;
        var legalItemOption = new toolbar_item_1.ToolbarItemOption();
        legalItemOption.icon = 'revert';
        legalItemOption.text = 'Send To Compliance';
        legalItemOption.onClick = function () {
            //this.onMapToApprovalProcess();
        };
        legalItem.options = legalItemOption;
        this.toolbarAdditionalItems.push(legalItem);
    };
    ApplicationDetailsComponent.prototype.addLegalOperationToolbar = function () {
        //Accepted
        var acceptedItem = new toolbar_item_1.ToolbarItem();
        acceptedItem.location = 'after';
        acceptedItem.widget = 'dxButton';
        acceptedItem.locateInMenu = 'auto';
        acceptedItem.visible = true;
        acceptedItem.disabled = false;
        var acceptedItemOption = new toolbar_item_1.ToolbarItemOption();
        acceptedItemOption.icon = 'check';
        acceptedItemOption.text = 'Accepted';
        acceptedItemOption.onClick = function () {
            //this.onMapToApprovalProcess();
        };
        acceptedItem.options = acceptedItemOption;
        this.toolbarAdditionalItems.push(acceptedItem);
        //Rejected
        var rejectItem = new toolbar_item_1.ToolbarItem();
        rejectItem.location = 'after';
        rejectItem.widget = 'dxButton';
        rejectItem.locateInMenu = 'auto';
        rejectItem.visible = true;
        rejectItem.disabled = false;
        var rejectItemOption = new toolbar_item_1.ToolbarItemOption();
        rejectItemOption.icon = 'remove';
        rejectItemOption.text = 'Rejected';
        rejectItemOption.onClick = function () {
            //this.onMapToApprovalProcess();
        };
        rejectItem.options = rejectItemOption;
        this.toolbarAdditionalItems.push(rejectItem);
    };
    /*****************************  Credit Operation & Compliance End ******************************** */
    ApplicationDetailsComponent.prototype.onCustomFieldvalueChanged = function (e, data) {
        //debugger;
        var exists = false;
        // iterate over each element in the array
        for (var i = 0; i < this.temporaryDataSource.length; i++) {
            if (this.temporaryDataSource[i].id == data.id) {
                //add to the targetted array
                //this.target.push(this.subCategorySelectItems[i]);
                this.temporaryDataSource[i].value = e.value;
                exists = true;
            }
        }
        if (!exists) {
            this.temporaryDataSource.push(data);
        }
    };
    ApplicationDetailsComponent.prototype.validateAndSave = function (action) {
        if (this.approvalStatusId > 0 && this.approvalStatusId != this.NotStarted) {
            if (!this.formValidation.instance.validate().isValid) {
                return;
            }
            this.saveEntity(action);
        }
        else {
            this.saveEntity(action);
        }
    };
    ApplicationDetailsComponent.prototype.saveEntity = function (action) {
        var _this = this;
        if (this.applicationId == 0) {
            this.loanService.createApplication("", this.applicationDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been saved successfully", 'Information');
                _this.applicationId = data.result;
                _this.entityModel.entityId = data.result;
                // ValidationEngine.resetGroup("formValidation");
                _this.redirectToListPage(action);
            });
        }
        else {
            if (this.approvalStatusId > 0 && this.approvalStatusId == this.InProgress) {
                this.applicationDataSource.currentAssigneeComments = this.questionsTextArea.value;
            }
            this.applicationDataSource.applicationCustomFields = this.temporaryDataSource;
            this.loanService.updateApplication("", this.applicationDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been updated successfully", 'Information');
                _this.applicationId = data.result;
                _this.entityModel.entityId = data.result;
                _this.questionsTextArea.value = null;
                //ValidationEngine.resetGroup("formValidation");
                _this.init();
                _this.redirectToListPage(action);
            });
        }
    };
    ApplicationDetailsComponent.prototype.redirectToListPage = function (action) {
        //debugger;
        var newNavigationUrl = '/loan/application';
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
    ApplicationDetailsComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    ApplicationDetailsComponent.prototype.onSaveNNewClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    ApplicationDetailsComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    ApplicationDetailsComponent.prototype.onCloseClicked = function (e) {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    ApplicationDetailsComponent.prototype.getAssignedByPhotoUrl = function (data) {
        var url = this.imageUrl;
        if (data.assignedByPhotoUrl != null)
            url = this.apiUrl + "/images/" + data.assignedByPhotoUrl;
        return url;
    };
    ApplicationDetailsComponent.prototype.getAssignedToPhotoUrl = function (data) {
        var url = this.imageUrl;
        if (data.assignedToPhotoUrl != null)
            url = this.apiUrl + "/images/" + data.assignedByPhotoUrl;
        return url;
    };
    ApplicationDetailsComponent.prototype.onDeleteNote = function (data) {
        var _this = this;
        this.loanService.deleteNoteRecord(data.id).subscribe(function (data) {
            _this.messageService.success("Note has been deleted successfully", 'Information');
            _this.init();
        });
    };
    __decorate([
        core_1.Input()
    ], ApplicationDetailsComponent.prototype, "entityModel", void 0);
    __decorate([
        core_1.ViewChild('formValidation')
    ], ApplicationDetailsComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], ApplicationDetailsComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild("questionsTextArea")
    ], ApplicationDetailsComponent.prototype, "questionsTextArea", void 0);
    ApplicationDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-loan-application',
            templateUrl: './application-form.component.html',
            styleUrls: ['./application-form.component.scss'],
        })
    ], ApplicationDetailsComponent);
    return ApplicationDetailsComponent;
}());
exports.ApplicationDetailsComponent = ApplicationDetailsComponent;
//# sourceMappingURL=application-form.component.js.map
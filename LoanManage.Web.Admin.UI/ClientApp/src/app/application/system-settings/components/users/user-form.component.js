"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var devextreme_angular_1 = require("devextreme-angular");
var titlebar_component_1 = require("./../../../application-shared/components/titlebar/titlebar.component");
var utilities_1 = require("./../../../application-shared/components/titlebar/utilities");
var custom_store_1 = require("devextreme/data/custom_store");
var toolbar_item_1 = require("../../../application-shared/components/titlebar/toolbar-item");
require("rxjs/add/operator/toPromise");
var UserFormComponent = /** @class */ (function () {
    /*********************************************** Event Start ****************************************/
    /**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    function UserFormComponent(roleService, userService, messageService, navigationService, route, router) {
        var _this = this;
        this.roleService = roleService;
        this.userService = userService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.roleDataSource = [];
        this.rightDataSource = [];
        this.treeListRoleInstance = undefined;
        this.treeListRightInstance = undefined;
        this.confirmedPassword = "";
        this.userDataSource = [];
        this.contactDataSource = [];
        this.photoDataSource = [];
        this.entityDataSource = [];
        this.timeZoneSelectItems = [];
        this.titleSelectItems = [];
        this.userTypeSelectItems = [];
        this.isSystemAdmin = false;
        this.fileUrl = "";
        this.selectedRowKeys = [];
        this.filterValue = null;
        this.userId = 0;
        this.password = "";
        this.expanded = false;
        this.emailPattern = utilities_1.PatterMatch.EmailPattern;
        this.contentClass = "detail-page-content-div";
        this.hideClass = "row form-group item-invisible";
        this.showClass = "row form-group item-visible";
        this.entityContentClass = this.showClass;
        this.entityName = "Contact";
        this.userType = utilities_1.UserType.Employee;
        this.isDropDownBoxOpened = false;
        this.gridDataSource = [];
        this._gridBoxValue = 0;
        this._gridSelectedRowKeys = [0];
        this.route.params.subscribe(function (params) {
            if (params['userid'] !== undefined) {
                _this.userId = params['userid'];
            }
        });
        this.passwordComparison = this.passwordComparison.bind(this);
        this.toolbarAdditionalItems = [];
    }
    Object.defineProperty(UserFormComponent.prototype, "isNewuser", {
        get: function () {
            return this.userId == 0 || this.userId == undefined || this.userId == null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Event
     **/
    UserFormComponent.prototype.ngAfterViewInit = function () {
        this.attachValidationToControl();
    };
    UserFormComponent.prototype.ngAfterContentChecked = function () {
        if (this.userId != 0) {
            //this.passwordTextbox.disabled = true;
            //this.confirmedPasswordTextbox.disabled = true;
        }
    };
    /**
     * Event
     **/
    UserFormComponent.prototype.ngOnInit = function () {
        this.addAdditionalToolbar();
        $(".dx-fileuploader").find(".dx-button-content").css("background-color", "transparent!important");
        this.init();
    };
    /**
     * Event
     * @param e
     */
    UserFormComponent.prototype.onRoleTreelistInitialized = function (e) {
        this.treeListRoleInstance = e.component;
    };
    /*
     * on expand clicked
     **/
    UserFormComponent.prototype.onExpandClicked = function () {
        var keys = [];
        this.treeListRoleInstance.forEachNode(function (node) {
            keys.push(node.key);
        });
        for (var index in keys) {
            this.treeListRoleInstance.expandRow(keys[index]);
        }
        keys = [];
        this.treeListRightInstance.forEachNode(function (node) {
            keys.push(node.key);
        });
        for (var index in keys) {
            this.treeListRightInstance.expandRow(keys[index]);
        }
    };
    /*
     * on collapse clicked
     **/
    UserFormComponent.prototype.onCollapseClicked = function () {
        var keys = [];
        this.treeListRoleInstance.forEachNode(function (node) {
            keys.push(node.key);
        });
        for (var index in keys) {
            this.treeListRoleInstance.collapseRow(keys[index]);
        }
        keys = [];
        this.treeListRightInstance.forEachNode(function (node) {
            keys.push(node.key);
        });
        for (var index in keys) {
            this.treeListRightInstance.collapseRow(keys[index]);
        }
    };
    /**
     * Event
     * @param e
     */
    UserFormComponent.prototype.onRightTreelistInitialized = function (e) {
        this.treeListRightInstance = e.component;
    };
    /**
    * OnRowSelection event
    * @param e
    */
    UserFormComponent.prototype.onRowSelection = function (e) {
        var _this = this;
        var selectedRoles = this.roleTreeList.instance.getSelectedRowKeys("all");
        var recordIds = [];
        //loop through the selected roles
        for (var item in selectedRoles) {
            recordIds.push(selectedRoles[item].toString());
        }
        this.roleService.getPermissionListByRole(recordIds).subscribe(function (data) {
            _this.rightDataSource = data.result;
        });
        //if data source is not null and undefined
        if (this.userDataSource != null && this.userDataSource != undefined) {
            this.userDataSource.userRoles = recordIds;
        }
    };
    /**
    * on save button clicked
    */
    UserFormComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    /**
     * on save and new button clicked
     */
    UserFormComponent.prototype.onSaveNNewClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    /**
     * on save and close button clicked
     */
    UserFormComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    /**
    * on close button clicked
    */
    UserFormComponent.prototype.onCloseClicked = function (e) {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    /**
     * on user type value changed
     * @param e
     */
    UserFormComponent.prototype.onUserTypeValueChanged = function (e) {
        //debugger;
        //if control is not disabled
        if (!this.userTypeSelectionBox.disabled) {
            if (e.value == utilities_1.UserType.Contact) {
                this.entityName = "Contact";
                this.userType = utilities_1.UserType.Contact;
                this.entityContentClass = this.showClass;
                this.entityDataSource = this.makeAsyncDataSource(e.value, this.userService);
            }
            else if (e.value == utilities_1.UserType.Employee) {
                this.entityName = "Employee";
                this.userType = utilities_1.UserType.Employee;
                this.entityContentClass = this.showClass;
                this.entityDataSource = this.makeAsyncDataSource(e.value, this.userService);
            }
            else {
                this.entityContentClass = this.hideClass;
                this.contactDataSource = this.userDataSource.contact;
                this.photoDataSource = this.userDataSource.contact.photo;
                this.userType = utilities_1.UserType.User;
                this.imageUploadControl.setEntityValue(this.photoDataSource);
                this.entitySourceSelectionBox.value = null;
                this.emailtextbox.value = null;
            }
            //debugger;
            if (this.userId == 0 || this.userId == null) {
                if (e.value == utilities_1.UserType.Contact || e.value == utilities_1.UserType.Employee) {
                    this.entitySourceValidation.validationRules = [{ type: 'required', message: this.entityName + ' is required.' }];
                }
                else {
                    this.entitySourceValidation.validationRules = [{ type: 'custom', validationCallback: this.validateCustomRule }];
                }
            }
        }
    };
    Object.defineProperty(UserFormComponent.prototype, "gridBoxValue", {
        /************************************************ Method Start *********************************** */
        get: function () {
            return this._gridBoxValue;
        },
        set: function (value) {
            if (value == null) {
                this._gridSelectedRowKeys = [];
            }
            //this._gridSelectedRowKeys = value && [value] || [];
            this._gridBoxValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserFormComponent.prototype, "gridSelectedRowKeys", {
        get: function () {
            return this._gridSelectedRowKeys;
        },
        set: function (value) {
            this._gridBoxValue = value.length && value[0] || null;
            this._gridSelectedRowKeys = value;
        },
        enumerable: true,
        configurable: true
    });
    UserFormComponent.prototype.gridBox_displayExpr = function (item) {
        return item && item.name;
    };
    UserFormComponent.prototype.setValue = function (id) {
        this._gridSelectedRowKeys.push(id);
    };
    UserFormComponent.prototype.getValue = function () {
        return this._gridSelectedRowKeys.length > 0 ? this._gridSelectedRowKeys[0] : 0;
    };
    UserFormComponent.prototype.onSelectionChanged = function (e) {
        this.isDropDownBoxOpened = false;
        if (this.userType == utilities_1.UserType.Contact) {
            this.setContactInformation();
        }
        else if (this.userType == utilities_1.UserType.Employee) {
            this.setContactInformation();
        }
    };
    UserFormComponent.prototype.setContactInformation = function () {
        var _this = this;
        if (this.getValue() > 0) {
            this.userService.getContactDetailForUserCreation(this.getValue()).subscribe(function (data) {
                _this.contactDataSource = data.result.contactModel;
                _this.photoDataSource = data.result.contactModel.photo;
                _this.imageUploadControl.setEntityValue(_this.photoDataSource);
                _this.emailtextbox.value = _this.contactDataSource.email;
            });
        }
    };
    /**
     * make data source
     * @param id
     * @param contactService
     */
    UserFormComponent.prototype.makeAsyncDataSource = function (userType, userService) {
        return new custom_store_1.default({
            loadMode: "raw",
            key: "id",
            load: function () {
                return userService.getEntitiesDataSource(userType).toPromise().then(function (response) {
                    return response;
                });
            }
        });
    };
    ;
    /*
     * add additional menu item
     **/
    UserFormComponent.prototype.addAdditionalToolbar = function () {
        var _this = this;
        //expand menu
        var expandItem = new toolbar_item_1.ToolbarItem();
        expandItem.location = 'after';
        expandItem.widget = 'dxButton';
        expandItem.locateInMenu = 'auto';
        expandItem.visible = true;
        expandItem.disabled = false;
        var expandItemOption = new toolbar_item_1.ToolbarItemOption();
        expandItemOption.icon = 'chevrondown';
        expandItemOption.text = 'Expand';
        expandItemOption.onClick = function () {
            _this.onExpandClicked();
        };
        expandItem.options = expandItemOption;
        this.toolbarAdditionalItems.push(expandItem);
        //collapse menu
        var collapseItem = new toolbar_item_1.ToolbarItem();
        collapseItem.location = 'after';
        collapseItem.widget = 'dxButton';
        collapseItem.locateInMenu = 'auto';
        collapseItem.visible = true;
        collapseItem.disabled = false;
        var collapseItemOption = new toolbar_item_1.ToolbarItemOption();
        collapseItemOption.icon = 'chevronup';
        collapseItemOption.text = 'Collapse';
        collapseItemOption.onClick = function () {
            _this.onCollapseClicked();
        };
        collapseItem.options = collapseItemOption;
        this.toolbarAdditionalItems.push(collapseItem);
    };
    /**
     * attach validation to the controls
     *
     * */
    UserFormComponent.prototype.attachValidationToControl = function () {
        //{ type: 'email', message: 'Email is invalid' },
        //validation                
        this.firstNameValidation.validationRules = [{ type: 'required', message: 'First Name is required.' }];
        this.lastNameValidation.validationRules = [{ type: 'required', message: 'Last Name is required.' }];
        this.emailValidation.validationRules =
            [{ type: 'required', message: 'Email is required.' },
                { type: 'pattern', pattern: this.emailPattern, message: 'Email is invalid' }];
        this.timeZoneValidation.validationRules = [{ type: 'required', message: 'Time Zone is required.' }];
        this.userNameValidation.validationRules = [{ type: 'required', message: 'Username is required.' }];
        this.userTypeValidation.validationRules = [{ type: 'required', message: 'User type is required.' }];
        if (this.userId == 0 || this.userId == null) {
            this.passwordValidation.validationRules = [{ type: 'required', message: 'Password is required.' }];
            this.confirmPasswordValidation.validationRules =
                [{ type: 'required', message: 'Confirm Password is required.' },
                    { type: 'compare', comparisonType: '==', comparisonTarget: this.passwordComparison, message: 'Password and Confirm Password do not match.' }];
        }
        else {
            //this.confirmPasswordValidation.validationRules =
            //    [{ type: 'compare', comparisonType: '==', comparisonTarget: this.passwordComparison, message: 'Password and Confirm Password do not match.' }];
            //this.confirmPasswordValidation.validationRules = [{ type: 'custom', validationCallback: this.validateConfirmedPassword, message: 'Password and Confirm Password do not match.'  }];
        }
    };
    UserFormComponent.prototype.validateCustomRule = function () {
        return true;
    };
    UserFormComponent.prototype.validateConfirmedPassword = function () {
        if (this.userDataSource.newPassword != undefined) {
            if (this.userDataSource.newPassword != undefined) {
                if (this.userDataSource.newPassword == this.confirmedPassword) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * password comparison
     * */
    UserFormComponent.prototype.passwordComparison = function () {
        //debugger;
        if (this.userId > 0)
            return "";
        return this.userDataSource.newPassword;
    };
    ;
    /**
     * Init method
     **/
    UserFormComponent.prototype.init = function () {
        var _this = this;
        //detail data source
        this.userService.getUserDetailEntity(this.userId).subscribe(function (data) {
            _this.timeZoneSelectItems = data.result.timeZoneSelectItems;
            _this.titleSelectItems = data.result.titleSelectItems;
            _this.userTypeSelectItems = data.result.userTypeSelectItems;
            _this.roleDataSource = data.result.userRoleSelectItems.result;
            _this.userDataSource = data.result.user;
            _this.contactDataSource = data.result.user.contact;
            _this.photoDataSource = data.result.user.contact.photo;
            _this.isSystemAdmin = data.result.user.isSystemAdmin;
            if (_this.isSystemAdmin) {
                _this.titlebar.initializeToolbar(_this.userId == "" ? "User : New" : "User : " + data.result.user.contact.firstName + " " + data.result.user.contact.lastName, _this.toolbarAdditionalItems, utilities_1.ToolbarType.DetailPage, true);
            }
            else {
                _this.titlebar.initializeToolbar(_this.userId == "" ? "User : New" : "User : " + data.result.user.contact.firstName + " " + data.result.user.contact.lastName, _this.toolbarAdditionalItems, utilities_1.ToolbarType.DetailPage, false);
            }
            _this.imageUploadControl.setEntityValue(_this.photoDataSource);
            if (_this.userId == 0 || _this.userId == undefined || _this.userId == null) {
                var offset = new Date().getTimezoneOffset() * -1;
                var defaultTZ = data.result.timeZoneSelectItems.filter(function (x) { return x.tag == offset; });
                if (defaultTZ.length > 0) {
                    _this.contactDataSource.timeZoneId = defaultTZ[0].id;
                }
            }
            else {
                _this.userTypeSelectionBox.disabled = true;
                _this.entityContentClass = _this.hideClass;
            }
        });
    };
    /**
     *
     * @param closedWindow
     * @param isNew
     */
    UserFormComponent.prototype.saveEntity = function (action) {
        var _this = this;
        if (this.userType == utilities_1.UserType.Contact) {
            this.userDataSource.contact = this.contactDataSource;
            this.userDataSource.contact.photo = this.imageUploadControl.photoDataSource;
        }
        else if (this.userType == utilities_1.UserType.Employee) {
            this.userDataSource.contact = this.contactDataSource;
            this.userDataSource.contact.photo = this.imageUploadControl.photoDataSource;
        }
        else {
            //get the photo data source to update child data source
            this.userDataSource.contact.photo = this.imageUploadControl.photoDataSource;
        }
        if (this.userId == 0 || this.userId == null) {
            this.userService.createUser(this.userDataSource).subscribe(function (data) {
                _this.userId = data.result;
                _this.messageService.success("Record has been save successfully", 'Information');
                if (_this.userId != 0) {
                    _this.passwordTextbox.value = "";
                    _this.confirmedPasswordTextbox.value = "";
                }
                _this.redirectToListPage(action);
            });
        }
        else {
            this.userService.updateUser(this.userId, this.userDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been save successfully", 'Information');
                _this.imageUploadControl.photoDataSource.isUpdated = false;
                if (_this.userId != 0) {
                    _this.passwordTextbox.value = "";
                    _this.confirmedPasswordTextbox.value = "";
                }
                _this.redirectToListPage(action);
            });
        }
    };
    /**
     * validate and save data
     */
    UserFormComponent.prototype.validateAndSave = function (action) {
        if (this.userDataSource.newPassword != "") {
            if (this.userDataSource.newPassword != this.confirmedPassword) {
                this.messageService.error("Password and Confirm Password do not match.", 'Error');
                return;
            }
        }
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    };
    /**
    * redirect to list page
    */
    UserFormComponent.prototype.redirectToListPage = function (action) {
        var newNavigationUrl = '/system-settings/user';
        if (action == utilities_1.DetailPageAction.Close || action == utilities_1.DetailPageAction.SaveAndClose) {
            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.userId, this.router.url);
        }
    };
    __decorate([
        core_1.ViewChild('roleTreeList')
    ], UserFormComponent.prototype, "roleTreeList", void 0);
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], UserFormComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild('passwordTextbox')
    ], UserFormComponent.prototype, "passwordTextbox", void 0);
    __decorate([
        core_1.ViewChild('confirmedPasswordTextbox')
    ], UserFormComponent.prototype, "confirmedPasswordTextbox", void 0);
    __decorate([
        core_1.ViewChild('imgUploadControl')
    ], UserFormComponent.prototype, "imageUploadControl", void 0);
    __decorate([
        core_1.ViewChild(devextreme_angular_1.DxTreeListComponent)
    ], UserFormComponent.prototype, "treeList", void 0);
    __decorate([
        core_1.ViewChild('formValidation')
    ], UserFormComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.ViewChild('firstNameValidation')
    ], UserFormComponent.prototype, "firstNameValidation", void 0);
    __decorate([
        core_1.ViewChild('lastNameValidation')
    ], UserFormComponent.prototype, "lastNameValidation", void 0);
    __decorate([
        core_1.ViewChild('emailValidation')
    ], UserFormComponent.prototype, "emailValidation", void 0);
    __decorate([
        core_1.ViewChild('timeZoneValidation')
    ], UserFormComponent.prototype, "timeZoneValidation", void 0);
    __decorate([
        core_1.ViewChild('userNameValidation')
    ], UserFormComponent.prototype, "userNameValidation", void 0);
    __decorate([
        core_1.ViewChild('passwordValidation')
    ], UserFormComponent.prototype, "passwordValidation", void 0);
    __decorate([
        core_1.ViewChild('confirmPasswordValidation')
    ], UserFormComponent.prototype, "confirmPasswordValidation", void 0);
    __decorate([
        core_1.ViewChild('entitySourceValidation')
    ], UserFormComponent.prototype, "entitySourceValidation", void 0);
    __decorate([
        core_1.ViewChild('userTypeValidation')
    ], UserFormComponent.prototype, "userTypeValidation", void 0);
    __decorate([
        core_1.ViewChild('userTypeCombobox')
    ], UserFormComponent.prototype, "userTypeSelectionBox", void 0);
    __decorate([
        core_1.ViewChild('entitySourceCombobox')
    ], UserFormComponent.prototype, "entitySourceSelectionBox", void 0);
    __decorate([
        core_1.ViewChild('emailtextbox')
    ], UserFormComponent.prototype, "emailtextbox", void 0);
    UserFormComponent = __decorate([
        core_1.Component({
            selector: '.app-user-form',
            templateUrl: './user-form.component.html',
            styleUrls: ['./user-form.component.scss'],
        })
    ], UserFormComponent);
    return UserFormComponent;
}());
exports.UserFormComponent = UserFormComponent;
//# sourceMappingURL=user-form.component.js.map

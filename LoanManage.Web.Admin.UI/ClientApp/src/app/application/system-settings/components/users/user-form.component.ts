import { Component, AfterViewInit, ViewChild, Inject, AfterContentChecked } from '@angular/core';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule, DxTextBoxModule, DxCheckBoxModule, DxValidatorModule, DxValidationGroupComponent, DxColorBoxComponent, DxTreeListComponent, DxTreeListModule, DxFileUploaderComponent, DxValidatorComponent, DxSelectBoxComponent, DxTagBoxComponent, DxTextBoxComponent, DxDropDownBoxComponent } from 'devextreme-angular';
import { MessageService } from './../../../../shared/services/message.service'
import { NavigationService } from './../../../../shared/services/navigation.service'
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ImageUploadComponent } from './../../../application-shared/components/common/image-upload.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToolbarType, DetailPageAction, PatterMatch, UserType } from './../../../application-shared/components/titlebar/utilities';
import { retry, debounce } from 'rxjs/operators';
import { RoleService } from './../../../system-settings/services/role.service';
import { UserService } from './../../../system-settings/services/user.service';
import DataSource from 'devextreme/data/data_source';
import CustomStore from "devextreme/data/custom_store";
import { HttpClient, HttpClientModule, HttpParams } from "@angular/common/http";
import { ToolbarItem, ToolbarItemOption } from '../../../application-shared/components/titlebar/toolbar-item';
import "rxjs/add/operator/toPromise";
declare var $: any;

@Component({
    selector: '.app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
})

export class UserFormComponent implements AfterViewInit, AfterContentChecked {

    roleDataSource: any = [];
    rightDataSource: any = [];
    treeListRoleInstance = undefined;
    treeListRightInstance = undefined;
    confirmedPassword: any = "";

    userDataSource: any = [];
    contactDataSource: any = [];
    photoDataSource: any = [];
    entityDataSource: any = [];


    timeZoneSelectItems: any = [];
    titleSelectItems: any = [];
    userTypeSelectItems: any = [];

    isSystemAdmin: boolean = false;
    fileUrl: any = "";
    selectedRowKeys: any[] = [];
    expandedRows: string[];
    filterValue: any = null;
    userId: any = 0;
    password: string = "";
    expanded: boolean = false;
    toolbarAdditionalItems: ToolbarItem[];
    businessProfileId: any;
    emailPattern: any = PatterMatch.EmailPattern;
    contentClass: any = "detail-page-content-div";

    hideClass: string = "row form-group item-invisible";
    showClass: string = "row form-group item-visible";
    entityContentClass: any = this.showClass;

    entityName: any = "Contact";
    userType: any = UserType.Employee;

    isDropDownBoxOpened: boolean = false;
    gridDataSource: any = [];
    _gridBoxValue: number = 0;
    _gridSelectedRowKeys: number[] = [0];


    @ViewChild('roleTreeList')
    roleTreeList: DxTreeListComponent;

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('passwordTextbox')
    private passwordTextbox: DxTextBoxComponent;

    @ViewChild('confirmedPasswordTextbox')
    private confirmedPasswordTextbox: DxTextBoxComponent;

    @ViewChild('imgUploadControl')
    private imageUploadControl: ImageUploadComponent;

    @ViewChild(DxTreeListComponent)
    private treeList: DxTreeListComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;


    @ViewChild('firstNameValidation')
    private firstNameValidation: DxValidatorComponent;

    @ViewChild('lastNameValidation')
    private lastNameValidation: DxValidatorComponent;

    @ViewChild('emailValidation')
    private emailValidation: DxValidatorComponent;

    @ViewChild('timeZoneValidation')
    private timeZoneValidation: DxValidatorComponent;



    @ViewChild('userNameValidation')
    private userNameValidation: DxValidatorComponent;

    @ViewChild('passwordValidation')
    private passwordValidation: DxValidatorComponent;

    @ViewChild('confirmPasswordValidation')
    private confirmPasswordValidation: DxValidatorComponent;



    @ViewChild('entitySourceValidation')
    private entitySourceValidation: DxValidatorComponent;

    @ViewChild('userTypeValidation')
    private userTypeValidation: DxValidatorComponent;

    @ViewChild('userTypeCombobox')
    private userTypeSelectionBox: DxSelectBoxComponent;

    @ViewChild('entitySourceCombobox')
    private entitySourceSelectionBox: DxDropDownBoxComponent;

    @ViewChild('emailtextbox')
    private emailtextbox: DxTextBoxComponent;




    /*********************************************** Event Start ****************************************/

    /**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    constructor(private roleService: RoleService,
        private userService: UserService,
        private messageService: MessageService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router) {

        this.route.params.subscribe(params => {
            if (params['userid'] !== undefined) {
                this.userId = params['userid'];
            }
        });

        this.passwordComparison = this.passwordComparison.bind(this);
        this.toolbarAdditionalItems = [];
    }

    private get isNewuser(): boolean {
        return this.userId == 0 || this.userId == undefined || this.userId == null;
    }


    /**
     * Event
     **/
    ngAfterViewInit(): void {

        this.attachValidationToControl();
    }

    ngAfterContentChecked(): void {

        if (this.userId != 0) {
            //this.passwordTextbox.disabled = true;
            //this.confirmedPasswordTextbox.disabled = true;
        }


    }

    /**
     * Event
     **/
    ngOnInit(): void {

        this.addAdditionalToolbar();
        $(".dx-fileuploader").find(".dx-button-content").css("background-color", "transparent!important");
        this.init();
    }

    /**
     * Event
     * @param e
     */
    onRoleTreelistInitialized(e) {

        this.treeListRoleInstance = e.component;
    }

    /*
     * on expand clicked
     **/
    onExpandClicked() {

        var keys: any[] = [];
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
    }

    /*
     * on collapse clicked
     **/
    onCollapseClicked() {

        var keys: any[] = [];
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
    }

    /**
     * Event
     * @param e
     */
    onRightTreelistInitialized(e) {
        this.treeListRightInstance = e.component;
    }

    /**
    * OnRowSelection event
    * @param e
    */
    onRowSelection(e) {
        var selectedRoles = this.roleTreeList.instance.getSelectedRowKeys("all");

        var recordIds: any[] = [];
        //loop through the selected roles
        for (let item in selectedRoles) {
            recordIds.push(selectedRoles[item].toString());
        }

        this.roleService.getPermissionListByRole(recordIds).subscribe(data => {
            this.rightDataSource = data.result;
        });

        //if data source is not null and undefined
        if (this.userDataSource != null && this.userDataSource != undefined) {
            this.userDataSource.userRoles = recordIds;
        }
    }

    /**
    * on save button clicked
    */
    onSaveClicked(e): void {

        this.validateAndSave(DetailPageAction.Save);
    }

    /**
     * on save and new button clicked
     */
    onSaveNNewClicked(e): void {

        this.validateAndSave(DetailPageAction.SaveAndNew);
    }

    /**
     * on save and close button clicked
     */
    onSaveNCloseClicked(e): void {

        this.validateAndSave(DetailPageAction.SaveAndClose);
    }

    /**
    * on close button clicked
    */
    onCloseClicked(e): void {
        this.redirectToListPage(DetailPageAction.Close);
    }

    /**
     * on user type value changed
     * @param e
     */
    onUserTypeValueChanged(e): void {
        //debugger;


        //if control is not disabled
        if (!this.userTypeSelectionBox.disabled) {

            if (e.value == UserType.Contact) {
                this.entityName = "Contact";
                this.userType = UserType.Contact;
                this.entityContentClass = this.showClass;
                this.entityDataSource = this.makeAsyncDataSource(e.value, this.userService);


            }
            else if (e.value == UserType.Employee) {
                this.entityName = "Employee";
                this.userType = UserType.Employee;
                this.entityContentClass = this.showClass;
                this.entityDataSource = this.makeAsyncDataSource(e.value, this.userService);
            }
            else {
                this.entityContentClass = this.hideClass;
                this.contactDataSource = this.userDataSource.contact;
                this.photoDataSource = this.userDataSource.contact.photo;
                this.userType = UserType.User;
                this.imageUploadControl.setEntityValue(this.photoDataSource);
                this.entitySourceSelectionBox.value = null;
                this.emailtextbox.value = null;
            }

            //debugger;
            if (this.userId == 0 || this.userId == null) {
                if (e.value == UserType.Contact || e.value == UserType.Employee) {
                    this.entitySourceValidation.validationRules = [{ type: 'required', message: this.entityName + ' is required.' }];
                }
                else {
                    this.entitySourceValidation.validationRules = [{ type: 'custom', validationCallback: this.validateCustomRule }];
                }
            }
        }
    }

    /************************************************ Method Start *********************************** */

    get gridBoxValue(): number {
        return this._gridBoxValue;
    }

    set gridBoxValue(value: number) {
        if (value == null) {
            this._gridSelectedRowKeys = [];
        }
        //this._gridSelectedRowKeys = value && [value] || [];
        this._gridBoxValue = value;
    }

    get gridSelectedRowKeys(): number[] {
        return this._gridSelectedRowKeys;
    }

    set gridSelectedRowKeys(value: number[]) {
        this._gridBoxValue = value.length && value[0] || null;
        this._gridSelectedRowKeys = value;
    }

    gridBox_displayExpr(item) {
        return item && item.name;
    }

    setValue(id: number): void {
        this._gridSelectedRowKeys.push(id);
    }

    getValue(): number {

        return this._gridSelectedRowKeys.length > 0 ? this._gridSelectedRowKeys[0] : 0;
    }

    onSelectionChanged(e) {

        this.isDropDownBoxOpened = false;

        if (this.userType == UserType.Contact) {
            this.setContactInformation();
        }
        else if (this.userType == UserType.Employee) {
            this.setContactInformation();
        }
    }

    setContactInformation(): void {

        if (this.getValue() > 0) {
            this.userService.getContactDetailForUserCreation(this.getValue()).subscribe(data => {
                this.contactDataSource = data.result.contactModel;
                this.photoDataSource = data.result.contactModel.photo;
                this.imageUploadControl.setEntityValue(this.photoDataSource);

                this.emailtextbox.value = this.contactDataSource.email;
            });
        }


    }

    /**
     * make data source
     * @param id
     * @param contactService
     */
    makeAsyncDataSource(userType: any, userService: UserService) {
        return new CustomStore({
            loadMode: "raw",
            key: "id",
            load: () => {
                return userService.getEntitiesDataSource(userType).toPromise().then((response: any) => {
                    return response;
                })
            }
        });
    };

    /*
     * add additional menu item
     **/
    addAdditionalToolbar() {

        //expand menu
        var expandItem = new ToolbarItem();
        expandItem.location = 'after';
        expandItem.widget = 'dxButton';
        expandItem.locateInMenu = 'auto';
        expandItem.visible = true;
        expandItem.disabled = false;

        var expandItemOption = new ToolbarItemOption();
        expandItemOption.icon = 'chevrondown';
        expandItemOption.text = 'Expand';
        expandItemOption.onClick = () => {
            this.onExpandClicked();
        };
        expandItem.options = expandItemOption;
        this.toolbarAdditionalItems.push(expandItem);

        //collapse menu
        var collapseItem = new ToolbarItem();
        collapseItem.location = 'after';
        collapseItem.widget = 'dxButton';
        collapseItem.locateInMenu = 'auto';
        collapseItem.visible = true;
        collapseItem.disabled = false;

        var collapseItemOption = new ToolbarItemOption();
        collapseItemOption.icon = 'chevronup';
        collapseItemOption.text = 'Collapse';
        collapseItemOption.onClick = () => {
            this.onCollapseClicked();
        };
        collapseItem.options = collapseItemOption;
        this.toolbarAdditionalItems.push(collapseItem);

    }


    /**
     * attach validation to the controls
     *
     * */
    attachValidationToControl() {

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
    }

    validateCustomRule(): boolean {
        return true;
    }

    validateConfirmedPassword(): boolean {

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
    }

    /**
     * password comparison
     * */
    passwordComparison() {
        //debugger;
        if (this.userId > 0)
            return "";
        return this.userDataSource.newPassword;
    };

    /**
     * Init method
     **/
    init(): void {

        //detail data source
        this.userService.getUserDetailEntity(this.userId).subscribe(data => {
            
            this.timeZoneSelectItems = data.result.timeZoneSelectItems;
            this.titleSelectItems = data.result.titleSelectItems;
            this.userTypeSelectItems = data.result.userTypeSelectItems;

            this.roleDataSource = data.result.userRoleSelectItems.result;
            this.userDataSource = data.result.user;
            this.contactDataSource = data.result.user.contact;
            this.photoDataSource = data.result.user.contact.photo;
            this.isSystemAdmin = data.result.user.isSystemAdmin;

            if (this.isSystemAdmin) {
                this.titlebar.initializeToolbar(this.userId == "" ? "User : New" : "User : " + data.result.user.contact.firstName + " " + data.result.user.contact.lastName, this.toolbarAdditionalItems, ToolbarType.DetailPage, true);
            }
            else {
                this.titlebar.initializeToolbar(this.userId == "" ? "User : New" : "User : " + data.result.user.contact.firstName + " " + data.result.user.contact.lastName, this.toolbarAdditionalItems, ToolbarType.DetailPage, false);
            }

            
            this.imageUploadControl.setEntityValue(this.photoDataSource);

            if (this.userId == 0 || this.userId == undefined || this.userId == null) {
                var offset = new Date().getTimezoneOffset() * -1;
                var defaultTZ = data.result.timeZoneSelectItems.filter(x => x.tag == offset);
                if (defaultTZ.length > 0) {
                    this.contactDataSource.timeZoneId = defaultTZ[0].id;
                }
            }
            else {

                this.userTypeSelectionBox.disabled = true;
                this.entityContentClass = this.hideClass;
            }
        });
    }

    /**
     * 
     * @param closedWindow
     * @param isNew
     */
    saveEntity(action: DetailPageAction): void {

        if (this.userType == UserType.Contact) {

            this.userDataSource.contact = this.contactDataSource;
            this.userDataSource.contact.photo = this.imageUploadControl.photoDataSource;
        }
        else if (this.userType == UserType.Employee) {

            this.userDataSource.contact = this.contactDataSource;
            this.userDataSource.contact.photo = this.imageUploadControl.photoDataSource;
        }
        else {
            //get the photo data source to update child data source
            this.userDataSource.contact.photo = this.imageUploadControl.photoDataSource;
        }

        if (this.userId == 0 || this.userId == null) {
            this.userService.createUser(this.userDataSource).subscribe(data => {
                this.userId = data.result;
                this.messageService.success("Record has been save successfully", 'Information');
                if (this.userId != 0) {
                    this.passwordTextbox.value = "";
                    this.confirmedPasswordTextbox.value = "";
                }
                this.redirectToListPage(action);
            });
        } else {
            this.userService.updateUser(this.userId, this.userDataSource).subscribe(data => {
                this.messageService.success("Record has been save successfully", 'Information');
                this.imageUploadControl.photoDataSource.isUpdated = false;
                if (this.userId != 0) {
                    this.passwordTextbox.value = "";
                    this.confirmedPasswordTextbox.value = "";
                }
                this.redirectToListPage(action);
            });
        }
    }

    /**
     * validate and save data
     */
    validateAndSave(action: DetailPageAction): void {


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
    }


    /**
    * redirect to list page
    */
    redirectToListPage(action: DetailPageAction): void {

        var newNavigationUrl = '/system-settings/user';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.userId, this.router.url);
        }
    }
}

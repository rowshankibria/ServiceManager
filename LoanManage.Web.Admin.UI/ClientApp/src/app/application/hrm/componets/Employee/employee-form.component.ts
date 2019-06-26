import { Component, AfterViewInit, ViewChild, Inject, Input, AfterContentChecked } from '@angular/core';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule, DxTextBoxModule, DxCheckBoxModule, DxValidatorModule, DxValidationGroupComponent, DxColorBoxComponent, DxTreeListComponent, DxTreeListModule, DxFileUploaderComponent, DxValidatorComponent, DxSelectBoxComponent, DxTextAreaComponent, DxTagBoxComponent, DxRadioGroupComponent, DxDropDownBoxComponent, DxDataGridComponent } from 'devextreme-angular';
import { MessageService } from './../../../../shared/services/message.service'
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ImageUploadComponent } from './../../../application-shared/components/common/image-upload.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToolbarType, DetailPageAction, PatterMatch } from './../../../application-shared/components/titlebar/utilities';
import { retry } from 'rxjs/operators';

import DataSource from 'devextreme/data/data_source';
import CustomStore from "devextreme/data/custom_store";
import { HttpClient, HttpClientModule, HttpParams } from "@angular/common/http";
import { ToolbarItem, ToolbarItemOption } from '../../../application-shared/components/titlebar/toolbar-item';
import { EntitySelectBoxComponent } from '../../../application-shared/components/common/app-entity-select-box.component';
import { EmployeeService } from '../../services/employee.service';
import { CompanyService } from '../../../crm/services/company.service';
import { NavigationService } from './../../../../shared/services/navigation.service';
import { InlineAddressComponent } from './../../../system-service/components/address/inline-address.component'
import "rxjs/add/operator/toPromise";
declare var $: any;

@Component({
    selector: 'app-employee-form',
    templateUrl: './employee-form.component.html',
    styleUrls: ['./employee-form.component.scss']
})

export class EmployeeFormComponent implements AfterContentChecked {

    //@Input() entityModel: EntityModel = new EntityModel();

    @Input('EmployeeId') employeeId: number = 0;

    regionalOffice: any = 8;
    branchOffice: any = 9;
    headOffice: any = 10;
    selectedPostingZoneId = 0;

    toolbarType: ToolbarType = ToolbarType.DetailPage;
    minDate: Date = new Date(1900, 0, 1);
    nowDate: Date = new Date();
    maxDate: Date = new Date(this.nowDate.getFullYear() - 18, this.nowDate.getMonth(), this.nowDate.getDate());
    emailPattern: any = PatterMatch.EmailPattern;
    contentClass: any = "detail-page-content-div";

    employeeDataSource: any = [];
    contactDataSource: any = [];
    photoDataSource: any = [];

    titleSelectItems: any = [];
    positionSelectItems: any = [];
    imTypeSelectItems: any = [];
    genderSelectItems: any = [];
    departmentSelectItems: any = [];
    postingZoneTypeSelectItems: any = [];
    regionSelectItems: any = [];
    branchTypeSelectItems: any = [];

    hideRegionClass: string = "row form-group item-invisible";
    showRegionClass: string = "row form-group item-visible";
    regionContentClass: any = this.hideRegionClass;

    hideBranchClass: string = "row form-group item-invisible";
    showBranchClass: string = "row form-group item-visible";
    branchContentClass: any = this.hideBranchClass;

    toolbarAdditionalItems: ToolbarItem[];

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('imgUploadControl')
    private imageUploadControl: ImageUploadComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;


    @ViewChild('firstNameValidation')
    private firstNameValidation: DxValidatorComponent;

    @ViewChild('lastNameValidation')
    private lastNameValidation: DxValidatorComponent;

    @ViewChild('emailValidation')
    private emailValidation: DxValidatorComponent;

    @ViewChild('employeeIdValidation')
    private employeeIdValidation: DxValidatorComponent;


    /*********************************************** Event Start ****************************************/

    /**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    constructor(private employeeService: EmployeeService,
        private companyService: CompanyService,
        private messageService: MessageService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router) {


        this.route.params.subscribe(params => {
            if (params['employeeId'] !== undefined) {
                this.employeeId = params['employeeId'];
            }
        });
    }

    /**
     * Event
     **/
    ngAfterContentChecked(): void {
       
    }
    /**
     * Event
     **/
    ngOnInit(): void {

        $(".dx-fileuploader").find(".dx-button-content").css("background-color", "transparent!important");
        this.getEmployeeDetails();
        this.attachValidationToControl();

    }


    onPostingZoneValueChanged(e): void {

        if (e.value != null) {

            this.selectedPostingZoneId = e.value;

            if (e.value == this.regionalOffice) {

                this.regionContentClass = this.showRegionClass;
                this.branchContentClass = this.hideBranchClass;
            }
            else if (e.value == this.branchOffice) {

                this.regionContentClass = this.hideRegionClass;
                this.branchContentClass = this.showBranchClass;

            }
            else {

                this.regionContentClass = this.hideRegionClass;
                this.branchContentClass = this.hideBranchClass;

            }

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

    /************************************************ Method Start *********************************** */

    /**
     * On value changed
     **/
    onValueChanged(e): void {

        //let newValue = e.value;
        //if (newValue > 0)
        //    this.populateCompanyOnBusinessProfileSelectionChanged(newValue);

    }

    /**
     * on value changed of business profile tag box
     * @param e
     */
    onBusinessProfileSelectionChanged(e): void {


        let newValue = e.value;

    }





    /**
     * attach validation to the controls
     *
     * */
    attachValidationToControl() {


        //this.companyValidation.validationRules = [{ type: 'required', message: 'Company is required.' }];
        this.firstNameValidation.validationRules = [{ type: 'required', message: 'First Name is required.' }];
        this.lastNameValidation.validationRules = [{ type: 'required', message: 'Last Name is required.' }];
        this.employeeIdValidation.validationRules = [{ type: 'required', message: 'Employee ID is required.' }];


        this.emailValidation.validationRules = [{ type: 'required', message: 'Email is required.' },
        { type: 'pattern', pattern: this.emailPattern, message: 'Email is invalid' }];

    }

    /**
     * Init method
     **/
    getEmployeeDetails(): void {

        this.employeeService.getEmployeeDetails(this.employeeId).toPromise().then((response: any) => {

            this.employeeDataSource = response.result.employee,
                this.contactDataSource = response.result.employee.contact,

                this.titleSelectItems = response.result.titleSelectItems,
                this.positionSelectItems = response.result.positionSelectItems,
                this.imTypeSelectItems = response.result.imTypeSelectItems,
                this.genderSelectItems = response.result.genderSelectItems,
                this.departmentSelectItems = response.result.departmentSelectItems,
                this.postingZoneTypeSelectItems = response.result.postingZoneTypeSelectItems,
                this.regionSelectItems = response.result.regionSelectItems,
                this.branchTypeSelectItems = response.result.branchTypeSelectItems,

                this.photoDataSource = this.contactDataSource.photo,
                this.imageUploadControl.setEntityValue(this.photoDataSource),
                this.titlebar.initializeToolbar(this.employeeId == 0 ? "Employee : New" : "Employee : " + this.contactDataSource.firstName + " " + this.contactDataSource.lastName, null, this.toolbarType);
        });

    }

    /**
     * 
     * @param closedWindow
     * @param isNew
     */
    saveEntity(action: DetailPageAction): void {

        this.contactDataSource.photo = this.imageUploadControl.photoDataSource;
        this.employeeDataSource.contact = this.contactDataSource;

        if (this.employeeId == 0) {

            this.employeeService.createEmployee(this.imageUploadControl.fileName, this.employeeDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.employeeId = data.result;
                this.employeeDataSource.id = data.result;
                this.redirectToListPage(action);
            });
        }
        else {
            this.employeeService.updateEmployee(this.imageUploadControl.fileName, this.employeeId, this.employeeDataSource).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');

                this.imageUploadControl.photoDataSource.isUpdated = false;
                this.redirectToListPage(action);
            });
        }
    }

    /**
     * validate and save data
     */
    validateAndSave(action: DetailPageAction): void {
        debugger;
        if (this.selectedPostingZoneId == this.regionalOffice || this.selectedPostingZoneId == this.branchOffice) {

            if (this.contactDataSource.branchId == null && this.contactDataSource.companyId == null) {

                if (this.selectedPostingZoneId == this.regionalOffice) {
                    this.messageService.error("Region is required.", 'Validation');
                }
                else {
                    this.messageService.error("Branch is required.", 'Validation');
                }

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

        var newNavigationUrl = '/hrm/employee';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.employeeId, this.router.url);
        }

    }
}

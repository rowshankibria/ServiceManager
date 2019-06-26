import { Component, AfterViewInit, ViewChild, Inject, Input } from '@angular/core';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule, DxTextBoxModule, DxCheckBoxModule, DxValidatorModule, DxValidationGroupComponent, DxColorBoxComponent, DxTreeListComponent, DxTreeListModule, DxFileUploaderComponent, DxValidatorComponent, DxSelectBoxComponent, DxTextAreaComponent, DxTagBoxComponent, DxRadioGroupComponent, DxDropDownBoxComponent, DxDataGridComponent } from 'devextreme-angular';
import { MessageService } from './../../../../shared/services/message.service'
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ImageUploadComponent } from './../../../application-shared/components/common/image-upload.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToolbarType, DetailPageAction, PatterMatch } from './../../../application-shared/components/titlebar/utilities';
import { retry } from 'rxjs/operators';
import { RoleService } from './../../../system-settings/services/role.service';
import { UserService } from './../../../system-settings/services/user.service';
import DataSource from 'devextreme/data/data_source';
import CustomStore from "devextreme/data/custom_store";
import { HttpClient, HttpClientModule, HttpParams } from "@angular/common/http";
import { ToolbarItem, ToolbarItemOption } from '../../../application-shared/components/titlebar/toolbar-item';
import { EntityModel } from '../../../system-service/models/entityModel';
import { ContactService } from '../../services/contact.service';
import { NavigationService } from './../../../../shared/services/navigation.service';
import "rxjs/add/operator/toPromise";
declare var $: any;

@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.scss']
})

export class ContactFormComponent implements AfterViewInit {

    @Input() entityModel: EntityModel = new EntityModel();
    entityId: number = 0;
    contactId: number = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    minDate: Date = new Date(1900, 0, 1);
    nowDate: Date = new Date();
    maxDate: Date = new Date(this.nowDate.getFullYear() - 18, this.nowDate.getMonth(), this.nowDate.getDate());
    emailPattern: any = PatterMatch.EmailPattern;
    contentClass: any = "detail-page-content-div";

    contactDataSource: any = [];
    photoDataSource: any = [];

    businessProfileSelectItems: any = [];
    companySelectItems: any = [];
    titleSelectItems: any = [];
    positionSelectItems: any = [];
    timeZoneSelectItems: any = [];
    skillsSelectItems: any = [];
    imTypeSelectItems: any = [];
    preferredContactSelectItems: any = [];
    genderSelectItems: any = [];
    preferredPhoneTypeSelectItems: any = [];

    companySelectedValue: any;

    contactSpecialisations: any = [];
    companyIds: any = [];
    businessProfileIds: any = [];

    //_companyValue: number[] = [21];    
    _gridSelectedRowKeys: number[] = [];
    gridDataSource: any;

    isDropDownBoxOpened = false;
    toolbarAdditionalItems: ToolbarItem[];

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('imgUploadControl')
    private imageUploadControl: ImageUploadComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild('gridContainer')
    private gridContainer: DxDataGridComponent;

    @ViewChild('companyCombobox')
    private companyCombobox: DxDropDownBoxComponent;

    @ViewChild('businessProfileSelectionBox')
    private businessProfileSelectionBox: DxSelectBoxComponent;



    @ViewChild('businessProfileValidation')
    private businessProfileValidation: DxValidatorComponent;

    //@ViewChild('companyValidation')
    //private companyValidation: DxValidatorComponent;

    @ViewChild('firstNameValidation')
    private firstNameValidation: DxValidatorComponent;

    @ViewChild('lastNameValidation')
    private lastNameValidation: DxValidatorComponent;

    @ViewChild('emailValidation')
    private emailValidation: DxValidatorComponent;

    @ViewChild('email2Validation')
    private email2Validation: DxValidatorComponent;

    @ViewChild('email3Validation')
    private email3Validation: DxValidatorComponent;


    nepaliDateOfBirth: any;

    /*********************************************** Event Start ****************************************/

    /**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    constructor(private contactService: ContactService,
        private messageService: MessageService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router) {

        
        this.route.params.subscribe(params => {
            if (params['clientId'] !== undefined) {
                this.contactId = params['clientId'];
            }
        });
    }

    /**
     * Event
     **/
    ngAfterViewInit(): void {

    }

    /**
     * Event
     **/
    ngOnInit(): void {

        $(".dx-fileuploader").find(".dx-button-content").css("background-color", "transparent!important");
        this.init();
        this.attachValidationToControl();

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
        if (newValue.length > 0)
            this.populateCompanyOnBusinessProfileSelectionChanged(newValue);
    }

    /**
     * Populate company on business profile selection changed
     * @param id
     */
    populateCompanyOnBusinessProfileSelectionChanged(ids: any[]) {
        this.gridDataSource = this.makeAsyncDataSource(ids, this.contactService);
    }

    get gridBoxValue(): number[] {
        return this.companyIds;
    }

    set gridBoxValue(value: number[]) {
        
        this.companyIds = value || [];
    }

    /**
     * make data source
     * @param id
     * @param contactService
     */
    makeAsyncDataSource(ids: any[], contactService: ContactService) {
        return new CustomStore({
            loadMode: "raw",
            key: "id",
            load: () => {
                return contactService.getCompanyByBusinessProfile(ids).toPromise().then((response: any) => {
                    //set company value
                    if (this.contactDataSource != undefined) {
                        this.setCompanyValue(this.contactDataSource.companyIds);
                    }
                    return response.result;
                })
            }
        });
    };

    /**
     * on grid dropdown selection changed
     * @param e
     */
    onSelectionChanged(e) {
        //this.isDropDownBoxOpened = false;
    }


    /**
     * attach validation to the controls
     *
     * */
    attachValidationToControl() {

        //validation        
        //this.businessProfileValidation.validationRules = [{ type: 'required', message: 'Business Profile is required.' }];
        //this.companyValidation.validationRules = [{ type: 'required', message: 'Company is required.' }];
        this.firstNameValidation.validationRules = [{ type: 'required', message: 'First Name is required.' }];
        this.lastNameValidation.validationRules = [{ type: 'required', message: 'Last Name is required.' }];

        this.emailValidation.validationRules = [{ type: 'required', message: 'Email is required.' },
                                                { type: 'pattern', pattern: this.emailPattern, message: 'Email is invalid' }];
        //this.email2Validation.validationRules = [{ type: 'pattern', pattern: this.emailPattern, message: 'Email 2 is invalid' }];        
        //this.email3Validation.validationRules = [{ type: 'pattern', pattern: this.emailPattern, message: 'Email 3 is invalid' }];        
    }


    /**
     * Init method
     **/
    init(): void {

        this.contactService.getContact(this.contactId).toPromise().then((response: any) => {
            this.imTypeSelectItems = response.result.imTypeSelectItems,
                //this.businessProfileSelectItems = response.result.businessProfileSelectItems,
                this.companySelectItems = response.result.companySelectItems,
                this.titleSelectItems = response.result.titleSelectItems,
                this.positionSelectItems = response.result.positionSelectItems,
                this.timeZoneSelectItems = response.result.timezoneSelectItems,
                this.skillsSelectItems = response.result.skillsSelectItems,
                this.preferredPhoneTypeSelectItems = response.result.preferredPhoneTypeSelectItems,

                //this.preferredContactSelectItems = response.result.preferredContactMethodSelectItems,
                this.genderSelectItems = response.result.genderSelectItems,
                this.contactDataSource = response.result.contactModel,
                //this.contactSpecialisations = this.contactDataSource.contactSpecialisationIds,
                //this.companyIds = this.contactDataSource.companyIds,
                //this.businessProfileIds = this.contactDataSource.businessProfileIds,

                this.photoDataSource = this.contactDataSource.photo,
                this.imageUploadControl.setEntityValue(this.photoDataSource),
                this.titlebar.initializeToolbar(this.contactId == 0 ? "Client : New" : "Client : " + this.contactDataSource.firstName + " " + this.contactDataSource.lastName, null, this.toolbarType)
                //this.makeAsyncDataSource(this.contactDataSource.companyIds, this.contactService);

        });

    }

    /**
     * 
     * @param closedWindow
     * @param isNew
     */
    saveEntity(action: DetailPageAction): void {

        var dtp = this.nepaliDateOfBirth;
        
        this.contactDataSource.photo = this.imageUploadControl.photoDataSource;
        this.contactDataSource.contactSpecialisationIds = this.contactSpecialisations;
        this.contactDataSource.businessProfileIds = this.businessProfileIds;
        this.contactDataSource.companyIds = this.companyIds;

        if (this._gridSelectedRowKeys[0] != undefined)
            this.contactDataSource.companyId = this._gridSelectedRowKeys[0];

        if (this.contactId == 0) {
            this.contactService.createContact(this.imageUploadControl.fileName, this.contactDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.entityModel.entityId = data.result;
                this.contactDataSource.id = this.entityModel.entityId;
                this.redirectToListPage(action);
                this.contactId = data.result;
            });
        }
        else {
            this.contactService.updateContact(this.imageUploadControl.fileName, this.contactDataSource).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.entityModel.entityId = data.result;
                this.imageUploadControl.photoDataSource.isUpdated = false;
                this.redirectToListPage(action);
            });
        }
    }

    /**
     * validate and save data
     */
    validateAndSave(action: DetailPageAction): void {

        if (!this.formValidation.instance.validate().isValid) {
            return;
        }

        this.saveEntity(action);
    }

    /**
     * st company value to combobox
     * @param companyId
     */
    setCompanyValue(companyIds: any[]) {
        this.companyIds = companyIds;
    }


    /**
    * redirect to list page
    */
    redirectToListPage(action: DetailPageAction): void {

        var newNavigationUrl = '/crm/contact';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.contactId, this.router.url);
        }

    }
}

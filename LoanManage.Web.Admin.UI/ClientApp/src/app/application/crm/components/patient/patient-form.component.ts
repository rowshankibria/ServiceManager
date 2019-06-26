import { Component, AfterViewInit, ViewChild, Inject, Input } from '@angular/core';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule, DxTextBoxModule, DxCheckBoxModule, DxValidatorModule, DxValidationGroupComponent, DxColorBoxComponent, DxTreeListComponent, DxTreeListModule, DxFileUploaderComponent, DxValidatorComponent, DxSelectBoxComponent, DxTextAreaComponent, DxTagBoxComponent, DxRadioGroupComponent, DxDropDownBoxComponent, DxDataGridComponent, DxCheckBoxComponent } from 'devextreme-angular';
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
import { PatientService } from '../../services/patient.service';
import { NavigationService } from './../../../../shared/services/navigation.service';
import "rxjs/add/operator/toPromise";
import { debug } from 'util';
declare var $: any;

@Component({
    selector: 'app-patient-form',
    templateUrl: './patient-form.component.html',
    styleUrls: ['./patient-form.component.scss']
})

export class PatientFormComponent implements AfterViewInit {

    @Input() entityModel: EntityModel = new EntityModel();
    entityId: number = 0;
    contactId: number = 0;
    practitionerId: number = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    minDate: Date = new Date(1900, 0, 1);
    nowDate: Date = new Date();
    maxDate: Date = new Date(this.nowDate.getFullYear() - 18, this.nowDate.getMonth(), this.nowDate.getDate());
    emailPattern: any = PatterMatch.EmailPattern;
    contentClass: any = "detail-page-content-div";
    toolbarAdditionalItems: ToolbarItem[];
    
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

    patientDataSource: any = [];
    contactSpecialisations: any = [];
    companyIds: any = [];
    businessProfileIds: any = [];    

    //single selection dropdown box
    
    isDropDownBoxOpenedForPractitioner: boolean = false;
    practitionerDataSource: any = [];
    _gridBoxValuePractitioner: number;
    _gridSelectedRowKeysPractitioner: number[] = [0];

     
    _gridSelectedRowKeys: number[] = [];
    gridDataSource: any;
    isDropDownBoxOpened = false;
    companySelectedValue: any;

    hideClass: string = "row form-group item-invisible";
    showClass: string = "row form-group item-visible";
    entityContentClass: any = this.hideClass;


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

    @ViewChild('imTypeValidation')
    private imTypeValidation: DxValidatorComponent;

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

    @ViewChild('patientIdValidation')
    private patientIdValidation: DxValidatorComponent;

    @ViewChild('practitionerValidation')
    private practitionerValidation: DxValidatorComponent;

    @ViewChild('businessProfileControl')
    private businessProfileControl: DxTagBoxComponent;
    
    @ViewChild('practitionerCombobox')
    private practitionerControl: DxDropDownBoxComponent;

    @ViewChild('isActiveControl')
    private isActiveControl: DxCheckBoxComponent;

    /*********************************************** Event Start ****************************************/

    /**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    constructor(private patientService: PatientService,
        private messageService: MessageService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router) {

        
        this.route.params.subscribe(params => {            
            if (params['contactId'] !== undefined) {
                this.contactId = params['contactId'];                            
                this.toolbarType = ToolbarType.DetailTabPage;
                this.contentClass = "detail-page-content-div-tab";
            }

            if (params['practitionerId'] !== undefined) {
                this.practitionerId = params['practitionerId'];
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

    get practitionerGridBoxValue(): number {
        return this._gridBoxValuePractitioner;
    }

    set practitionerGridBoxValue(value: number) {
        if (value == null) {
            this._gridSelectedRowKeysPractitioner = [];
        }
        //this._gridSelectedRowKeys = value && [value] || [];
        this._gridBoxValuePractitioner = value;
    }

    get gridSelectedRowKeysPractitioner(): number[] {
        return this._gridSelectedRowKeysPractitioner;
    }

    set gridSelectedRowKeysPractitioner(value: number[]) {

        if (value == null) {
            this._gridBoxValuePractitioner = null;//value[0];//value.length && value[0] || null;        
            this._gridSelectedRowKeysPractitioner = [];
        }
        else {
            this._gridBoxValuePractitioner = value.length && value[0] || null;        
            this._gridSelectedRowKeysPractitioner = value;
        }
    }

    gridBoxPractitioner_displayExpr(item) {
        return item && item.name;
    }

    setValue(id: number): void {
        this._gridSelectedRowKeysPractitioner.push(id);
    }

    getValue(): number {

        return this._gridSelectedRowKeysPractitioner.length > 0 ? this._gridSelectedRowKeysPractitioner[0] : 0;
    }

    onPractitionerSelectionChanged(e) {
        this.isDropDownBoxOpenedForPractitioner = false;        
    }

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
        if (newValue.length > 0) {
            this.populateCompanyOnBusinessProfileSelectionChanged(newValue);
            this.practitionerDataSource = this.makePractitionerAsyncDataSource(this.businessProfileIds, this.patientService);
        }
    }

    /**
     * Populate company on business profile selection changed
     * @param id
     */
    populateCompanyOnBusinessProfileSelectionChanged(ids: any[]) {
        this.gridDataSource = this.makeAsyncDataSource(ids, this.patientService);        
    }

    get gridBoxValue(): number[] {        
        return this.companyIds;
    }

    set gridBoxValue(value: number[]) {        
        if(value == null)
            this.companyIds = [];
    }

    /**
     * make data source
     * @param id
     * @param patientService
     */
    makeAsyncDataSource(ids: any[], patientService: PatientService) {
        return new CustomStore({
            loadMode: "raw",
            key: "id",
            load: () => {
                return patientService.getCompanyByBusinessProfile(ids).toPromise().then((response: any) => {
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
    * make data source
    * @param id
    * @param patientService
    */
    makePractitionerAsyncDataSource(ids: any[], patientService: PatientService) {
        return new CustomStore({
            loadMode: "raw",
            key: "id",
            load: () => {
                return patientService.getPractitionerByBusinessProfile(ids).toPromise().then((response: any) => {
                    
                    //set practitioner value
                    if (this.patientDataSource != undefined) {
                        this.setValue(this.patientDataSource.practitionerContactId);

                        if (this.practitionerId > 0 && this.contactId == 0)
                            this.setValue(this.practitionerId);
                    }

                    return response;
                })
            }
        });
    };

    /**
    * st practitioner value to combobox
    * @param practitionerId
    */
    setPractitionerValue(practitionerId: number) {
        //this.practitionerGridBoxValue(practitionerId);
    }

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
        this.businessProfileValidation.validationRules = [{ type: 'required', message: 'Business Profile is required.' }];
        this.patientIdValidation.validationRules = [{ type: 'required', message: 'Patient ID is required.' }];
        this.practitionerValidation.validationRules = [{ type: 'required', message: 'Practitioner is required.' }];
        
        this.imTypeValidation.validationRules = [{ type: 'required', message: 'Social Media is required.' }];
        this.firstNameValidation.validationRules = [{ type: 'required', message: 'First Name is required.' }];
        this.lastNameValidation.validationRules = [{ type: 'required', message: 'Last Name is required.' }];
        this.emailValidation.validationRules = [{ type: 'required', message: 'Email is required.' },
                                                { type: 'pattern', pattern: this.emailPattern, message: 'Email is invalid' }];
        this.email2Validation.validationRules = [{ type: 'pattern', pattern: this.emailPattern, message: 'Email 2 is invalid' }];        
        this.email3Validation.validationRules = [{ type: 'pattern', pattern: this.emailPattern, message: 'Email 3 is invalid' }];        
    }


    /**
     * Init method
     **/
    init(): void {
        
        this.patientService.getContact(this.contactId, this.practitionerId).toPromise().then((response: any) => {

            this.imTypeSelectItems = response.result.imTypeSelectItems,
                this.businessProfileSelectItems = response.result.businessProfileSelectItems,
                this.companySelectItems = response.result.companySelectItems,
                this.titleSelectItems = response.result.titleSelectItems,
                this.positionSelectItems = response.result.positionSelectItems,
                this.timeZoneSelectItems = response.result.timezoneSelectItems,
                this.skillsSelectItems = response.result.skillsSelectItems,
                this.preferredPhoneTypeSelectItems = response.result.preferredPhoneTypeSelectItems,

                this.preferredContactSelectItems = response.result.preferredContactMethodSelectItems,
                this.genderSelectItems = response.result.genderSelectItems,
                this.contactDataSource = response.result.contactModel,
                this.contactSpecialisations = this.contactDataSource.contactSpecialisationIds,
                this.companyIds = this.contactDataSource.companyIds,
                this.businessProfileIds = this.contactDataSource.businessProfileIds,
                this.patientDataSource = this.contactDataSource.patient,

                this.photoDataSource = this.contactDataSource.photo,
                this.imageUploadControl.setEntityValue(this.photoDataSource),
                this.titlebar.initializeToolbar(this.contactId == 0 ? "Patient: New" : "Patient: " + this.contactDataSource.firstName + " " + this.contactDataSource.lastName, null, this.toolbarType),
                this.makeAsyncDataSource(this.contactDataSource.companyIds, this.patientService),                
                this.makePractitionerAsyncDataSource(this.businessProfileIds, this.patientService);

        });

        if (this.practitionerId > 0) {
            this.practitionerControl.disabled = true;
            this.businessProfileControl.disabled = true;
        }
    }

    /**
     * 
     * @param closedWindow
     * @param isNew
     */
    saveEntity(action: DetailPageAction): void {
        
        this.contactDataSource.photo = this.imageUploadControl.photoDataSource;
        this.contactDataSource.contactSpecialisationIds = this.contactSpecialisations;
        this.contactDataSource.businessProfileIds = this.businessProfileIds;
        this.contactDataSource.companyIds = this.companyIds;
        this.patientDataSource.practitionerContactId = this.getValue();
        this.contactDataSource.patient = this.patientDataSource;

        if (this._gridSelectedRowKeys[0] != undefined)
            this.contactDataSource.companyId = this._gridSelectedRowKeys[0];

        if (this.contactId == 0) {
            this.patientService.createContact(this.imageUploadControl.fileName, this.contactDataSource).subscribe(data => {
                
                this.messageService.success("Record has been saved successfully", 'Information');
                this.entityModel.entityId = data.result;
                this.contactDataSource.id = this.entityModel.entityId;
                this.contactId = data.result;
                this.redirectToListPage(action);
            });
        }
        else {
            this.patientService.updateContact(this.imageUploadControl.fileName, this.contactDataSource).subscribe(data => {
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
        var newNavigationUrl = '/crm/patient';

        if (this.practitionerId > 0)
            newNavigationUrl = '/crm/practitioner-patient/' + this.practitionerId; //+ '/';

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

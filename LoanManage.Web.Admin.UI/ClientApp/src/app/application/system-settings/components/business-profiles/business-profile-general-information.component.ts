import { Component, Input, Output, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { DxTextAreaModule, DxFormModule, DxTextBoxModule, DxCheckBoxModule, DxValidatorModule, DxValidationGroupComponent, DxValidatorComponent, DxFileUploaderComponent } from 'devextreme-angular';
import { MessageService } from './../../../../shared/services/message.service'
import { NavigationService } from './../../../../shared/services/navigation.service'
import { BusinessProfileService } from './../../../system-settings/services/business-profile.service'
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ImageUploadComponent } from './../../../application-shared/components/common/image-upload.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../../application-shared/components/titlebar/utilities';
import { retry } from 'rxjs/operators';

import DataSource from 'devextreme/data/data_source';
import { HttpClient, HttpClientModule, HttpParams } from "@angular/common/http";
import "rxjs/add/operator/toPromise";
declare var $: any;

@Component({
    selector: 'app-business-profile-general-information',
    templateUrl: './business-profile-general-information.component.html',
    styleUrls: ['./business-profile-general-information.component.scss']
})

export class BusinessProfileGeneralInformationComponent {

    @Input() businessProfileId: any = 0;
    @Output() businessProfileUniqueRowId: string;

    businessProfileDataSource: any = [];
    emptyBusinessProfileDataSource: any = [];
    countrySelectItemsDataSource: any = [];
    photoDataSource: any = [];
    disabledDefaultCheckbox: boolean = false;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    contentClass: any = "detail-page-content-div";

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('imgUploadControl')
    private imageUploadControl: ImageUploadComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild('companyNameValidation')
    private companyNameValidation: DxValidatorComponent;

    @ViewChild('emailValidation')
    private emailValidation: DxValidatorComponent;

    constructor(private businessProfileService: BusinessProfileService,
        private messageService: MessageService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router) {

        this.route.params.subscribe(params => {
            if (params['businessProfileId'] !== undefined) {
                this.businessProfileId = params['businessProfileId'];                
            }
        });
    }

    ngOnInit(): void {

        $(".dx-fileuploader").find(".dx-button-content").css("background-color", "transparent!important");
        this.init();
        this.attachValidationToControl();
    }


    attachValidationToControl() {

        //validation   
        this.companyNameValidation.validationRules = [{ type: 'required', message: 'First Name is required.' }];
        this.emailValidation.validationRules = [{ type: 'email', message: 'Email is invalid' }];
    }


    /**
 * Data source binding
 * */
    init(): void {
        this.businessProfileService.getBusinessProfile(this.businessProfileId).toPromise().then((response: any) => {
            this.businessProfileDataSource = response.result.businessProfileModel;
           
            this.businessProfileUniqueRowId = response.result.businessProfileModel.uniqueEntityId;
            this.emptyBusinessProfileDataSource = response.result.emptyBusinessProfileModel;
            this.businessProfileId = this.businessProfileDataSource.id;
            this.disabledDefaultCheckbox = this.businessProfileDataSource.isDefault;
            this.photoDataSource = this.businessProfileDataSource.logo;            
            this.imageUploadControl.setEntityValue(this.photoDataSource);
            this.countrySelectItemsDataSource = response.result.countrySelectItems;
            this.titlebar.initializeToolbar(this.businessProfileId == 0 ? "Head Office : New" : "Head Office: " + this.businessProfileDataSource.companyName, null, this.toolbarType);
        });
    }


    saveEntity(action: DetailPageAction): void {

        this.businessProfileDataSource.logo = this.imageUploadControl.photoDataSource;

        if (this.businessProfileId == 0) {
            this.businessProfileService.createBusinessProfiles(this.businessProfileDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');

                this.businessProfileId = data.result;
                this.businessProfileDataSource.id = this.businessProfileId;
                this.redirectToListPage(action);

            });
        }
        else {
            this.businessProfileService.updateBusinessProfiles(this.businessProfileId, this.businessProfileDataSource).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.businessProfileId = data.result;
                this.imageUploadControl.photoDataSource.isUpdated = false;
                this.redirectToListPage(action);
            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        var newNavigationUrl = '/system-settings/business-profile';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.businessProfileId, this.router.url);
        }

    }

    onCountryValueChanged(event: any) {
        //if (this.formDataSource.countryId > 0) {
        //    this.addressService.getStateList(this.formDataSource.countryId).toPromise().then((response: any) => {
        //        this.stateSelectItemsDataSource = response.result;//set property
        //    });
        //}
        //else {
        //    this.stateSelectItemsDataSource = [];
        //}
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
     * on save button clicked
     */
    onSaveClicked(e): void {

        this.validateAndSave(DetailPageAction.Save);
    }

    /**
     * on save and new button clicked
     */
    onSaveNNewClicked(): void {

        this.validateAndSave(DetailPageAction.SaveAndNew);
    }

    /**
     * on save and close button clicked
     */
    onSaveNCloseClicked(): void {

        this.validateAndSave(DetailPageAction.SaveAndClose);
    }
    /**
    * on close button clicked
    */
    onCloseClicked(): void {
        this.redirectToListPage(DetailPageAction.Close);
    }

}

import { Component, ViewChild, AfterContentChecked, Input, OnInit } from '@angular/core';
import { DxFormModule, DxTextBoxModule, DxSelectBoxModule, DxCheckBoxModule, DxValidatorModule, DxValidationGroupComponent, DxValidatorComponent, DxAutocompleteComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { MessageService } from './../../../../shared/services/message.service'
import { NavigationService } from './../../../../shared/services/navigation.service'
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../../application-shared/components/titlebar/utilities';
import { retry } from 'rxjs/operators';
import { debug } from 'util';
import { IDetailPage } from './../../../application-shared/interfaces'
import { AddressService } from './../../services/address.service'
import data from 'devextreme/data/odata/store';
declare var $: any;

@Component({
    selector: 'app-address-list-detail',
    templateUrl: './address-form.component.html',
    styleUrls: ['./address-form.component.scss']
})

export class AddressComponent implements OnInit, AfterContentChecked, IDetailPage {

    @ViewChild(TitlebarComponent)
    private addressTitleBar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild('cbState')
    private cbState: DxSelectBoxComponent


    @Input('RecordId') recordId = 0;
    @Input('BusinessProfileId') businessProfileId = 0;
    @Input('UniqueEntityId') uniqueEntityId: any;
    @Input('EntityId') entityId: number;

    addressComponentKey = 'entity-addresses';

    paramKeyId = 'id'; //set param key
    paramKeyEntity = 'uniqueEntityId'; //set param key
    formTitle = 'Address'; // set form
    formDataSource: any = [];    
    addressTypeSelectItemsDataSource: any = [];
    countrySelectItemsDataSource: any = [];
    stateSelectItemsDataSource: any = [];
    suburbDataSource: any = [];
    
    isInitDataLoaded = false;

    showDetail = false;

    disabledDefaultCheckbox = false;
    defaultCountryId: number;
    isDefaultBusinessProfileUser = false;
    disabledInUpdateMode = true;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    contentClass: any = "detail-page-content-div";

    constructor(private addressService: AddressService,
        private messageService: MessageService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router) {

        this.route.params.subscribe(params => {
            if (params[this.paramKeyId] !== undefined) {
                this.recordId = params[this.paramKeyId];
                this.toolbarType = ToolbarType.DetailPage;
                //this.contentClass = "detail-page-content-div-tab";
            }

            if (params[this.paramKeyEntity] !== undefined) {
                this.uniqueEntityId = params[this.paramKeyId];
                this.toolbarType = ToolbarType.DetailPage;
                //this.contentClass = "detail-page-content-div-tab";
            }
        });
    }

    ngOnInit(): void {
        //this.init();
        this.toolbarType = ToolbarType.DetailPage;
        this.addressTitleBar.initializeToolbar('Address', null, this.toolbarType);

        this.showListPage();
    }

    loadAddressInitData(): void {
        if (!this.isInitDataLoaded) {

            this.addressService.getInitAddressData(this.uniqueEntityId, this.businessProfileId).toPromise().then((response: any) => {

                this.addressTypeSelectItemsDataSource = response.result.addressTypeSelectItems;
                this.countrySelectItemsDataSource = response.result.countrySelectItems;
                this.suburbDataSource = response.result.suburbDataSource

                this.disabledDefaultCheckbox = this.formDataSource.isPrimary;
                this.isDefaultBusinessProfileUser = response.result.isDefaultBusinessProfile;

                this.defaultCountryId = response.result.address.countryId;
                 
                this.isInitDataLoaded = true;
                
            });
        }
    }

    loadAddressInfo(): any {

        this.addressService.getRecordInfoById(this.recordId, this.uniqueEntityId, this.entityId, this.businessProfileId).toPromise().then((response: any) => {

            this.addressTitleBar.setToolbarTitle(this.recordId == 0 ? this.formTitle + ": New" : this.formTitle + ": " + response.result.address.displayAddress);
             
            this.formDataSource = response.result.address;
            this.disabledDefaultCheckbox = this.formDataSource.isPrimary;

        
        });

    }

    loadSuburbDataSource(): void {
        if (!this.isInitDataLoaded) {
            
            this.addressService.getSuburbList().toPromise().then((response: any) => {
                this.suburbDataSource = response.result;//set property

            });
        }
    }

    ngAfterContentChecked(): void {

        
        this.disabledInUpdateMode = this.recordId > 0 && this.isDefaultBusinessProfileUser;
        
        if (this.defaultCountryId > 0 && this.recordId == 0 && this.formDataSource.countryId ==null) {
            this.formDataSource.countryId = this.defaultCountryId;
        }
         
    }

    saveEntity(action: DetailPageAction): void {

        if (this.recordId == 0) {
            this.addressService.createRecord(this.formDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');

                this.recordId = data.result;//Set Record Id                
                this.formDataSource.id = data.result;
                this.redirectToListPage(action);

            });
        }
        else {
            this.addressService.updateRecord(this.recordId, this.formDataSource).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.redirectToListPage(action);
            });
        }
    }


    onSuburbItemClick(e): void {

        if (e.itemData != null || e.itemData != undefined) {
            this.formDataSource.stateId = e.itemData.stateId;
            this.formDataSource.postCode = e.itemData.postCode;
            this.formDataSource.countryId = e.itemData.countryId;
        }

    }

    onCountryValueChanged(e): void {
        if (this.formDataSource.countryId > 0) {
            this.addressService.getStateList(this.formDataSource.countryId).toPromise().then((response: any) => {
                this.stateSelectItemsDataSource = response.result;//set property
            });
        }
        else {
            this.stateSelectItemsDataSource = [];
        }
    }

    onGridEditLinkClick(e): void {


        this.showDetailPage(e.id);
    }
    onGridNewButtonClick(e): void {

        this.showDetailPage(0);
    }

    showDetailPage(id: number): void {

        this.recordId = id;
        this.loadAddressInitData();
        this.loadAddressInfo();
        this.showDetail = true;
        $('#titlebardetail').css("display", "block");
    }

    showListPage(): void {
        this.showDetail = false;
        $('#titlebardetail').css("display", "none");
    }

    redirectToListPage(action: DetailPageAction): void {

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {
            this.showListPage();
        }
        else if (action == DetailPageAction.SaveAndNew) {
            this.showDetailPage(0);
        }
        else if (action == DetailPageAction.Save) {            
            var title = this.formDataSource.street + (this.formDataSource.suburb.length > 0 ? ', ' + this.formDataSource.suburb : '')
                + (this.formDataSource.stateId > 0 ? ', ' + this.cbState.text : '')
                + (this.formDataSource.postCode.length > 0 ? ', ' + this.formDataSource.postCode : '')

            this.addressTitleBar.setToolbarTitle(this.recordId == 0 ? this.formTitle + ": New" : this.formTitle + ": " + title);
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
        //this.redirectToListPage(DetailPageAction.Close);
        this.showListPage();
    }

}

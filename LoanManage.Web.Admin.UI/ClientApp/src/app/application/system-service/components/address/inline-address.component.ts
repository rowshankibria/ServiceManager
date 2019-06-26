import { Component, ViewChild, AfterContentChecked, Input, OnInit } from '@angular/core';
import { DxFormModule, DxTextBoxModule, DxSelectBoxModule, DxCheckBoxModule, DxValidatorModule, DxValidationGroupComponent, DxValidatorComponent, DxAutocompleteComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { MessageService } from './../../../../shared/services/message.service'
import { NavigationService } from './../../../../shared/services/navigation.service'
//import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../../application-shared/components/titlebar/utilities';
import { retry } from 'rxjs/operators';
import { debug } from 'util';
import { IDetailPage } from './../../../application-shared/interfaces'
import { AddressService } from './../../services/address.service'
import data from 'devextreme/data/odata/store';
import { add } from 'ngx-bootstrap/chronos';
import validation_group from 'devextreme/ui/validation_group';
declare var $: any;

@Component({
    selector: 'inline-address',
    templateUrl: './inline-address.component.html',
    styleUrls: ['./inline-address.component.scss']
})

export class InlineAddressComponent implements OnInit, AfterContentChecked {


    @ViewChild('addrressFormValidation')
    private addrressFormValidation: DxValidationGroupComponent;

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
    addressDataSource: any = [];
    formDataSource: any = [];
    addressTypeSelectItemsDataSource: any = [];
    countrySelectItemsDataSource: any = [];
    stateSelectItemsDataSource: any = [];
    suburbDataSource: any = [];

    isInitDataLoaded = false;
    isListDataLoaded = false;

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
 
    }

    ngOnInit(): void {
      
    }

    ngAfterContentChecked(): void {
         
        if (this.uniqueEntityId != null && this.uniqueEntityId != undefined && this.entityId > 0) {
            this.loadAddressList();
        }

        if (this.defaultCountryId > 0 && this.recordId == 0 && this.formDataSource.countryId == null) {
            this.formDataSource.countryId = this.defaultCountryId;
        }

    }

    loadAddressList(): void {
        if (!this.isListDataLoaded) {

            this.addressService.getAddressModelListByUniqueEntityIdId(this.uniqueEntityId, this.entityId).toPromise().then((response: any) => {
                this.addressDataSource = response.result;
            });

            this.isListDataLoaded = true;
        }
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
        if (this.recordId >= 0) {
            this.addressService.getRecordInfoById(this.recordId, this.uniqueEntityId, this.entityId, this.businessProfileId).toPromise().then((response: any) => {
 
                this.formDataSource = response.result.address;
                this.disabledDefaultCheckbox = this.formDataSource.isPrimary; 
            });
        }
        else {

            let selectedAdd = this.addressDataSource.filter(x => x.id == this.recordId);

            if (selectedAdd.length > 0) {
                this.formDataSource = selectedAdd[0];
            }

        }

    }

    loadSuburbDataSource(): void {
        if (!this.isInitDataLoaded) {

            this.addressService.getSuburbList().toPromise().then((response: any) => {
                this.suburbDataSource = response.result;//set property

            });
        }
    }



    saveEntity(action: DetailPageAction): void {
        if (this.entityId > 0) {
            if (this.recordId == 0) {
                this.addressService.createRecord(this.formDataSource).subscribe(data => {
                    this.messageService.success("Address has been saved successfully", 'Information');

                    this.recordId = data.result;//Set Record Id                
                    this.formDataSource.id = data.result;
                    this.showAddressList(true);

                });
            }
            else {
                this.addressService.updateRecord(this.recordId, this.formDataSource).subscribe(data => {
                    this.messageService.success("Address has been updated successfully", 'Information');                    

                    this.showAddressList(true);
                });
            }
        }
        else {

            let addressType: string;
            let seletedAddressType = this.addressTypeSelectItemsDataSource.filter(x => x.id == this.formDataSource.addressTypeId);
            if (seletedAddressType.length > 0) {
                addressType = seletedAddressType[0].name
            }

            let stateName: string;
            let seletedState = this.stateSelectItemsDataSource.filter(x => x.id == this.formDataSource.stateId)
            if (seletedAddressType.length > 0) {
                stateName = seletedState[0].name
            }

            if (this.recordId < 0) {
                let selectedAdd = this.addressDataSource.filter(x => x.id == this.recordId);

                if (selectedAdd.length > 0) {
                    selectedAdd[0].addressTypeId = this.formDataSource.addressTypeId
                    selectedAdd[0].addressType = addressType
                    selectedAdd[0].street = this.formDataSource.street
                    selectedAdd[0].suburb = this.formDataSource.suburb
                    selectedAdd[0].stateId = this.formDataSource.stateId
                    selectedAdd[0].stateName = stateName
                    selectedAdd[0].postCode = this.formDataSource.postCode
                    selectedAdd[0].countryId = this.formDataSource.countryId
                    selectedAdd[0].isPrimary = this.formDataSource.isPrimary
                    selectedAdd[0].isActive = this.formDataSource.isActive
                    selectedAdd[0].isDirty = true
                }

            }
            else {
                let tempId = Math.floor(Math.random() * Math.floor(100000)) + Math.floor(Math.random() * Math.floor(1000000)) * -1;
                this.addressDataSource.push({
                    "id": tempId,
                    "addressTypeId": this.formDataSource.addressTypeId,
                    "addressType": addressType,
                    "street": this.formDataSource.street,
                    "suburb": this.formDataSource.suburb,
                    "stateId": this.formDataSource.stateId,
                    "stateName": stateName,
                    "postCode": this.formDataSource.postCode,
                    "countryId": this.formDataSource.countryId,
                    "isPrimary": this.formDataSource.isPrimary,
                    "isActive": this.formDataSource.isActive,
                    //"uniqueEntityId": this.formDataSource.uniqueEntityId,
                    "entityId": -1,
                    "isDirty": true
                });
            }
            this.showDetail = false;
        }
    }

    //return address list for new Entry
    getAddressesFromMemory(): any {

        if (this.entityId < 1) {

            let retDataSource = JSON.parse(JSON.stringify(this.addressDataSource));

            for (let addr of retDataSource) {
                
                addr.entityId = 0;
                addr.id = 0;
            }

            return retDataSource;
        }
        return null;
    }

    onAddClick(e) {

        this.showAddressDetail(0);
        e.stopPropagation();
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
                this.stateSelectItemsDataSource = response.result; 
            });
        }
        else {
            this.stateSelectItemsDataSource = [];
        }
    }



    showAddressDetail(id: number): void {

        this.recordId = id;
        this.loadAddressInitData();
        this.loadAddressInfo();
        this.showDetail = true;

    }

    showAddressList(reload: boolean): void {
        this.isListDataLoaded = !reload;
        this.loadAddressList();
        this.showDetail = false;

    }

    addOrUpdateAddress(): void {
        this.validateAndSave(DetailPageAction.Save);
    }

 

    deleteAdrress(addr: any): void {

        if (addr.id > 0) {
            this.addressService.deleteRecord(addr.id).subscribe(data => {
                this.messageService.showDataDeletedMsg();
                var index = this.addressDataSource.indexOf(addr);
                this.addressDataSource.splice(index, 1);               
            });
        }
        else {
            var index = this.addressDataSource.indexOf(addr);
            this.addressDataSource.splice(index, 1);
        }
    }

    /**
       * validate and save data
       */
    validateAndSave(action: DetailPageAction): void {

        if (!this.addrressFormValidation.instance.validate().isValid) {
            return;
        }

        this.saveEntity(action);
    }

 

}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var titlebar_component_1 = require("./../../../application-shared/components/titlebar/titlebar.component");
var utilities_1 = require("./../../../application-shared/components/titlebar/utilities");
var AddressComponent = /** @class */ (function () {
    function AddressComponent(addressService, messageService, navigationService, route, router) {
        var _this = this;
        this.addressService = addressService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.recordId = 0;
        this.businessProfileId = 0;
        this.addressComponentKey = 'entity-addresses';
        this.paramKeyId = 'id'; //set param key
        this.paramKeyEntity = 'uniqueEntityId'; //set param key
        this.formTitle = 'Address'; // set form
        this.formDataSource = [];
        this.addressTypeSelectItemsDataSource = [];
        this.countrySelectItemsDataSource = [];
        this.stateSelectItemsDataSource = [];
        this.suburbDataSource = [];
        this.isInitDataLoaded = false;
        this.showDetail = false;
        this.disabledDefaultCheckbox = false;
        this.isDefaultBusinessProfileUser = false;
        this.disabledInUpdateMode = true;
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.contentClass = "detail-page-content-div";
        this.route.params.subscribe(function (params) {
            if (params[_this.paramKeyId] !== undefined) {
                _this.recordId = params[_this.paramKeyId];
                _this.toolbarType = utilities_1.ToolbarType.DetailPage;
                //this.contentClass = "detail-page-content-div-tab";
            }
            if (params[_this.paramKeyEntity] !== undefined) {
                _this.uniqueEntityId = params[_this.paramKeyId];
                _this.toolbarType = utilities_1.ToolbarType.DetailPage;
                //this.contentClass = "detail-page-content-div-tab";
            }
        });
    }
    AddressComponent.prototype.ngOnInit = function () {
        //this.init();
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.addressTitleBar.initializeToolbar('Address', null, this.toolbarType);
        this.showListPage();
    };
    AddressComponent.prototype.loadAddressInitData = function () {
        var _this = this;
        if (!this.isInitDataLoaded) {
            this.addressService.getInitAddressData(this.uniqueEntityId, this.businessProfileId).toPromise().then(function (response) {
                _this.addressTypeSelectItemsDataSource = response.result.addressTypeSelectItems;
                _this.countrySelectItemsDataSource = response.result.countrySelectItems;
                _this.suburbDataSource = response.result.suburbDataSource;
                _this.disabledDefaultCheckbox = _this.formDataSource.isPrimary;
                _this.isDefaultBusinessProfileUser = response.result.isDefaultBusinessProfile;
                _this.defaultCountryId = response.result.address.countryId;
                _this.isInitDataLoaded = true;
            });
        }
    };
    AddressComponent.prototype.loadAddressInfo = function () {
        var _this = this;
        this.addressService.getRecordInfoById(this.recordId, this.uniqueEntityId, this.entityId, this.businessProfileId).toPromise().then(function (response) {
            _this.addressTitleBar.setToolbarTitle(_this.recordId == 0 ? _this.formTitle + ": New" : _this.formTitle + ": " + response.result.address.displayAddress);
            _this.formDataSource = response.result.address;
            _this.disabledDefaultCheckbox = _this.formDataSource.isPrimary;
        });
    };
    AddressComponent.prototype.loadSuburbDataSource = function () {
        var _this = this;
        if (!this.isInitDataLoaded) {
            this.addressService.getSuburbList().toPromise().then(function (response) {
                _this.suburbDataSource = response.result; //set property
            });
        }
    };
    AddressComponent.prototype.ngAfterContentChecked = function () {
        this.disabledInUpdateMode = this.recordId > 0 && this.isDefaultBusinessProfileUser;
        if (this.defaultCountryId > 0 && this.recordId == 0 && this.formDataSource.countryId == null) {
            this.formDataSource.countryId = this.defaultCountryId;
        }
    };
    AddressComponent.prototype.saveEntity = function (action) {
        var _this = this;
        if (this.recordId == 0) {
            this.addressService.createRecord(this.formDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been saved successfully", 'Information');
                _this.recordId = data.result; //Set Record Id                
                _this.formDataSource.id = data.result;
                _this.redirectToListPage(action);
            });
        }
        else {
            this.addressService.updateRecord(this.recordId, this.formDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been updated successfully", 'Information');
                _this.redirectToListPage(action);
            });
        }
    };
    AddressComponent.prototype.onSuburbItemClick = function (e) {
        if (e.itemData != null || e.itemData != undefined) {
            this.formDataSource.stateId = e.itemData.stateId;
            this.formDataSource.postCode = e.itemData.postCode;
            this.formDataSource.countryId = e.itemData.countryId;
        }
    };
    AddressComponent.prototype.onCountryValueChanged = function (e) {
        var _this = this;
        if (this.formDataSource.countryId > 0) {
            this.addressService.getStateList(this.formDataSource.countryId).toPromise().then(function (response) {
                _this.stateSelectItemsDataSource = response.result; //set property
            });
        }
        else {
            this.stateSelectItemsDataSource = [];
        }
    };
    AddressComponent.prototype.onGridEditLinkClick = function (e) {
        this.showDetailPage(e.id);
    };
    AddressComponent.prototype.onGridNewButtonClick = function (e) {
        this.showDetailPage(0);
    };
    AddressComponent.prototype.showDetailPage = function (id) {
        this.recordId = id;
        this.loadAddressInitData();
        this.loadAddressInfo();
        this.showDetail = true;
        $('#titlebardetail').css("display", "block");
    };
    AddressComponent.prototype.showListPage = function () {
        this.showDetail = false;
        $('#titlebardetail').css("display", "none");
    };
    AddressComponent.prototype.redirectToListPage = function (action) {
        if (action == utilities_1.DetailPageAction.Close || action == utilities_1.DetailPageAction.SaveAndClose) {
            this.showListPage();
        }
        else if (action == utilities_1.DetailPageAction.SaveAndNew) {
            this.showDetailPage(0);
        }
        else if (action == utilities_1.DetailPageAction.Save) {
            var title = this.formDataSource.street + (this.formDataSource.suburb.length > 0 ? ', ' + this.formDataSource.suburb : '')
                + (this.formDataSource.stateId > 0 ? ', ' + this.cbState.text : '')
                + (this.formDataSource.postCode.length > 0 ? ', ' + this.formDataSource.postCode : '');
            this.addressTitleBar.setToolbarTitle(this.recordId == 0 ? this.formTitle + ": New" : this.formTitle + ": " + title);
        }
    };
    /**
       * validate and save data
       */
    AddressComponent.prototype.validateAndSave = function (action) {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    };
    /**
     * on save button clicked
     */
    AddressComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    /**
     * on save and new button clicked
     */
    AddressComponent.prototype.onSaveNNewClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    /**
     * on save and close button clicked
     */
    AddressComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    /**
    * on close button clicked
    */
    AddressComponent.prototype.onCloseClicked = function (e) {
        //this.redirectToListPage(DetailPageAction.Close);
        this.showListPage();
    };
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], AddressComponent.prototype, "addressTitleBar", void 0);
    __decorate([
        core_1.ViewChild('formValidation')
    ], AddressComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.ViewChild('cbState')
    ], AddressComponent.prototype, "cbState", void 0);
    __decorate([
        core_1.Input('RecordId')
    ], AddressComponent.prototype, "recordId", void 0);
    __decorate([
        core_1.Input('BusinessProfileId')
    ], AddressComponent.prototype, "businessProfileId", void 0);
    __decorate([
        core_1.Input('UniqueEntityId')
    ], AddressComponent.prototype, "uniqueEntityId", void 0);
    __decorate([
        core_1.Input('EntityId')
    ], AddressComponent.prototype, "entityId", void 0);
    AddressComponent = __decorate([
        core_1.Component({
            selector: 'app-address-list-detail',
            templateUrl: './address-form.component.html',
            styleUrls: ['./address-form.component.scss']
        })
    ], AddressComponent);
    return AddressComponent;
}());
exports.AddressComponent = AddressComponent;
//# sourceMappingURL=address-form.component.js.map
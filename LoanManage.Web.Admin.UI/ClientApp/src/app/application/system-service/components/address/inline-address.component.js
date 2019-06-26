"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var utilities_1 = require("./../../../application-shared/components/titlebar/utilities");
var InlineAddressComponent = /** @class */ (function () {
    function InlineAddressComponent(addressService, messageService, navigationService, route, router) {
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
        this.addressDataSource = [];
        this.formDataSource = [];
        this.addressTypeSelectItemsDataSource = [];
        this.countrySelectItemsDataSource = [];
        this.stateSelectItemsDataSource = [];
        this.suburbDataSource = [];
        this.isInitDataLoaded = false;
        this.isListDataLoaded = false;
        this.showDetail = false;
        this.disabledDefaultCheckbox = false;
        this.isDefaultBusinessProfileUser = false;
        this.disabledInUpdateMode = true;
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.contentClass = "detail-page-content-div";
    }
    InlineAddressComponent.prototype.ngOnInit = function () {
    };
    InlineAddressComponent.prototype.ngAfterContentChecked = function () {
        if (this.uniqueEntityId != null && this.uniqueEntityId != undefined && this.entityId > 0) {
            this.loadAddressList();
        }
        if (this.defaultCountryId > 0 && this.recordId == 0 && this.formDataSource.countryId == null) {
            this.formDataSource.countryId = this.defaultCountryId;
        }
    };
    InlineAddressComponent.prototype.loadAddressList = function () {
        var _this = this;
        if (!this.isListDataLoaded) {
            this.addressService.getAddressModelListByUniqueEntityIdId(this.uniqueEntityId, this.entityId).toPromise().then(function (response) {
                _this.addressDataSource = response.result;
            });
            this.isListDataLoaded = true;
        }
    };
    InlineAddressComponent.prototype.loadAddressInitData = function () {
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
    InlineAddressComponent.prototype.loadAddressInfo = function () {
        var _this = this;
        if (this.recordId >= 0) {
            this.addressService.getRecordInfoById(this.recordId, this.uniqueEntityId, this.entityId, this.businessProfileId).toPromise().then(function (response) {
                _this.formDataSource = response.result.address;
                _this.disabledDefaultCheckbox = _this.formDataSource.isPrimary;
            });
        }
        else {
            var selectedAdd = this.addressDataSource.filter(function (x) { return x.id == _this.recordId; });
            if (selectedAdd.length > 0) {
                this.formDataSource = selectedAdd[0];
            }
        }
    };
    InlineAddressComponent.prototype.loadSuburbDataSource = function () {
        var _this = this;
        if (!this.isInitDataLoaded) {
            this.addressService.getSuburbList().toPromise().then(function (response) {
                _this.suburbDataSource = response.result; //set property
            });
        }
    };
    InlineAddressComponent.prototype.saveEntity = function (action) {
        var _this = this;
        if (this.entityId > 0) {
            if (this.recordId == 0) {
                this.addressService.createRecord(this.formDataSource).subscribe(function (data) {
                    _this.messageService.success("Address has been saved successfully", 'Information');
                    _this.recordId = data.result; //Set Record Id                
                    _this.formDataSource.id = data.result;
                    _this.showAddressList(true);
                });
            }
            else {
                this.addressService.updateRecord(this.recordId, this.formDataSource).subscribe(function (data) {
                    _this.messageService.success("Address has been updated successfully", 'Information');
                    _this.showAddressList(true);
                });
            }
        }
        else {
            var addressType = void 0;
            var seletedAddressType = this.addressTypeSelectItemsDataSource.filter(function (x) { return x.id == _this.formDataSource.addressTypeId; });
            if (seletedAddressType.length > 0) {
                addressType = seletedAddressType[0].name;
            }
            var stateName = void 0;
            var seletedState = this.stateSelectItemsDataSource.filter(function (x) { return x.id == _this.formDataSource.stateId; });
            if (seletedAddressType.length > 0) {
                stateName = seletedState[0].name;
            }
            if (this.recordId < 0) {
                var selectedAdd = this.addressDataSource.filter(function (x) { return x.id == _this.recordId; });
                if (selectedAdd.length > 0) {
                    selectedAdd[0].addressTypeId = this.formDataSource.addressTypeId;
                    selectedAdd[0].addressType = addressType;
                    selectedAdd[0].street = this.formDataSource.street;
                    selectedAdd[0].suburb = this.formDataSource.suburb;
                    selectedAdd[0].stateId = this.formDataSource.stateId;
                    selectedAdd[0].stateName = stateName;
                    selectedAdd[0].postCode = this.formDataSource.postCode;
                    selectedAdd[0].countryId = this.formDataSource.countryId;
                    selectedAdd[0].isPrimary = this.formDataSource.isPrimary;
                    selectedAdd[0].isActive = this.formDataSource.isActive;
                    selectedAdd[0].isDirty = true;
                }
            }
            else {
                var tempId = Math.floor(Math.random() * Math.floor(100000)) + Math.floor(Math.random() * Math.floor(1000000)) * -1;
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
    };
    //return address list for new Entry
    InlineAddressComponent.prototype.getAddressesFromMemory = function () {
        if (this.entityId < 1) {
            var retDataSource = JSON.parse(JSON.stringify(this.addressDataSource));
            for (var _i = 0, retDataSource_1 = retDataSource; _i < retDataSource_1.length; _i++) {
                var addr = retDataSource_1[_i];
                addr.entityId = 0;
                addr.id = 0;
            }
            return retDataSource;
        }
        return null;
    };
    InlineAddressComponent.prototype.onAddClick = function (e) {
        this.showAddressDetail(0);
        e.stopPropagation();
    };
    InlineAddressComponent.prototype.onSuburbItemClick = function (e) {
        if (e.itemData != null || e.itemData != undefined) {
            this.formDataSource.stateId = e.itemData.stateId;
            this.formDataSource.postCode = e.itemData.postCode;
            this.formDataSource.countryId = e.itemData.countryId;
        }
    };
    InlineAddressComponent.prototype.onCountryValueChanged = function (e) {
        var _this = this;
        if (this.formDataSource.countryId > 0) {
            this.addressService.getStateList(this.formDataSource.countryId).toPromise().then(function (response) {
                _this.stateSelectItemsDataSource = response.result;
            });
        }
        else {
            this.stateSelectItemsDataSource = [];
        }
    };
    InlineAddressComponent.prototype.showAddressDetail = function (id) {
        this.recordId = id;
        this.loadAddressInitData();
        this.loadAddressInfo();
        this.showDetail = true;
    };
    InlineAddressComponent.prototype.showAddressList = function (reload) {
        this.isListDataLoaded = !reload;
        this.loadAddressList();
        this.showDetail = false;
    };
    InlineAddressComponent.prototype.addOrUpdateAddress = function () {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    InlineAddressComponent.prototype.deleteAdrress = function (addr) {
        var _this = this;
        if (addr.id > 0) {
            this.addressService.deleteRecord(addr.id).subscribe(function (data) {
                _this.messageService.showDataDeletedMsg();
                var index = _this.addressDataSource.indexOf(addr);
                _this.addressDataSource.splice(index, 1);
            });
        }
        else {
            var index = this.addressDataSource.indexOf(addr);
            this.addressDataSource.splice(index, 1);
        }
    };
    /**
       * validate and save data
       */
    InlineAddressComponent.prototype.validateAndSave = function (action) {
        if (!this.addrressFormValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    };
    __decorate([
        core_1.ViewChild('addrressFormValidation')
    ], InlineAddressComponent.prototype, "addrressFormValidation", void 0);
    __decorate([
        core_1.ViewChild('cbState')
    ], InlineAddressComponent.prototype, "cbState", void 0);
    __decorate([
        core_1.Input('RecordId')
    ], InlineAddressComponent.prototype, "recordId", void 0);
    __decorate([
        core_1.Input('BusinessProfileId')
    ], InlineAddressComponent.prototype, "businessProfileId", void 0);
    __decorate([
        core_1.Input('UniqueEntityId')
    ], InlineAddressComponent.prototype, "uniqueEntityId", void 0);
    __decorate([
        core_1.Input('EntityId')
    ], InlineAddressComponent.prototype, "entityId", void 0);
    InlineAddressComponent = __decorate([
        core_1.Component({
            selector: 'inline-address',
            templateUrl: './inline-address.component.html',
            styleUrls: ['./inline-address.component.scss']
        })
    ], InlineAddressComponent);
    return InlineAddressComponent;
}());
exports.InlineAddressComponent = InlineAddressComponent;
//# sourceMappingURL=inline-address.component.js.map
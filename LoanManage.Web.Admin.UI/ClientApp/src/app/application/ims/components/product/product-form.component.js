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
var entityModel_1 = require("../../../system-service/models/entityModel");
require("rxjs/add/operator/toPromise");
var ProductFormComponent = /** @class */ (function () {
    /*********************************************** Event Start ****************************************/
    /**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    function ProductFormComponent(productService, messageService, navigationService, route, router) {
        var _this = this;
        this.productService = productService;
        this.messageService = messageService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.entityModel = new entityModel_1.EntityModel();
        this.entityId = 0;
        this.productId = 0;
        this.toolbarType = utilities_1.ToolbarType.DetailPage;
        this.productName = "English Name";
        this.contentClass = "detail-page-content-div";
        this.showItem = "row form-group item-visible";
        this.showGroup = "card mb-1 item-visible";
        this.hideItem = "row form-group item-invisible";
        this.hideGroup = "card mb-1 item-invisible";
        this.herbTypeClass = this.showItem;
        this.herbTypeNonManufactureClass = this.showItem;
        this.herbTypeClassGroup = this.showGroup;
        this.manufacturedClassGroup = this.hideGroup;
        this.key = 'id';
        this.display = 'name';
        this.format = { add: 'Assign Category(s)', remove: 'Unassign Category(s)', all: 'All', none: 'None', direction: 'left-to-right', draggable: true, locale: undefined };
        this.productDataSource = [];
        this.photoDataSource = [];
        this.herbTypeSelectItems = [];
        this.supplierSelectItems = [];
        this.uoMSelectItems = [];
        this.productTypeSelectItems = [];
        this.herbRatioSelectItems = [];
        this.subCategorySelectItems = [];
        this.subCategorySelectedItem = [];
        this.target = [];
        this.route.params.subscribe(function (params) {
            if (params['productId'] !== undefined) {
                _this.productId = params['productId'];
                _this.toolbarType = utilities_1.ToolbarType.DetailTabPage;
                _this.contentClass = "detail-page-content-div-tab";
            }
        });
    }
    /**
     * Event
     **/
    ProductFormComponent.prototype.ngAfterViewInit = function () {
        //this.formValidation.instance.validate();
    };
    /**
     * Event
     **/
    ProductFormComponent.prototype.ngOnInit = function () {
        $(".dx-fileuploader").find(".dx-button-content").css("background-color", "transparent!important");
        this.init();
        this.attachValidationToControl();
    };
    /**
    * on save button clicked
    */
    ProductFormComponent.prototype.onSaveClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.Save);
    };
    /**
     * on save and new button clicked
     */
    ProductFormComponent.prototype.onSaveNNewClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndNew);
    };
    /**
     * on save and close button clicked
     */
    ProductFormComponent.prototype.onSaveNCloseClicked = function (e) {
        this.validateAndSave(utilities_1.DetailPageAction.SaveAndClose);
    };
    /**
    * on close button clicked
    */
    ProductFormComponent.prototype.onCloseClicked = function (e) {
        this.redirectToListPage(utilities_1.DetailPageAction.Close);
    };
    /************************************************ Method Start *********************************** */
    /**
     * on value change for numeric control
     */
    ProductFormComponent.prototype.onNumericControlValueChanged = function (e) {
        //debugger;
        var value = e.value;
        if (value == null) {
            //e.component.option("value", 0);
            e.value = 0;
        }
    };
    /*
    * on product type value changed
    */
    ProductFormComponent.prototype.onProductTypeValueChanged = function (e) {
        var value = e.value;
        this.configureControlsUI(this.getProductTypeMap(value));
        if (e.previousValue != undefined && e.previousValue != null) {
            this.resetControls();
        }
    };
    /**
     * get product map type
     * @param value
     */
    ProductFormComponent.prototype.getProductTypeMap = function (value) {
        var mapType = 0;
        // iterate over each element in the array
        for (var i = 0; i < this.productTypeSelectItems.length; i++) {
            if (this.productTypeSelectItems[i].id == value) {
                //add to the targetted array
                mapType = this.productTypeSelectItems[i].tag;
            }
        }
        return mapType;
    };
    ProductFormComponent.prototype.configureControlsUI = function (mapType) {
        /*
         *  505	502	Herb
            506	502	Manufacturer Herbal
            507	502	Spoon
            508	502	Bag
            509	502	Envelope
            510	502	Sachet
            511	502	Stamp
         *
         */
        //if it is not herb and manufactured item
        if (mapType != 505 && mapType != 506 && mapType != 0) {
            this.herbTypeClass = this.hideItem;
            this.herbTypeNonManufactureClass = this.hideItem;
            this.herbTypeClassGroup = this.hideGroup;
            this.manufacturedClassGroup = this.hideGroup;
            this.productName = "Name";
        }
        //if it is manufactured item
        else if (mapType == 506) {
            this.manufacturedClassGroup = this.showGroup;
            this.herbTypeClass = this.showItem;
            this.herbTypeClassGroup = this.hideGroup;
            this.herbTypeNonManufactureClass = this.hideItem;
            this.productName = "English Name";
        }
        else {
            this.herbTypeClass = this.showItem;
            this.herbTypeNonManufactureClass = this.showItem;
            this.herbTypeClassGroup = this.showGroup;
            this.manufacturedClassGroup = this.hideGroup;
            this.productName = "English Name";
        }
        //call validation methods
        this.validateControls(mapType);
    };
    /**
     * reset control when switch to different product type
     * */
    ProductFormComponent.prototype.resetControls = function () {
        this.txtPinYinName.value = null;
        this.txtPharmacetual.value = null;
        this.txtAustralianApprovedName.value = null;
        this.txtNature.value = null;
        this.txtChannels.value = null;
        this.txtRawDoseRange.value = null;
        this.txtPremiumHerb.value = 0;
        this.chkToxic.value = false;
        this.txtToxicWarning.value = 0;
        this.txtMinimumSellingQtyPerBag.value = 0;
        this.cboHerbType.value = null;
        this.cboHerbRatio.value = null;
    };
    /**
     * attach validation to the controls
     *
     * */
    ProductFormComponent.prototype.attachValidationToControl = function () {
        var mapType = 0;
        var productTypeValue = this.cboProductType.value;
        mapType = this.getProductTypeMap(productTypeValue);
        this.validateControls(mapType);
    };
    ProductFormComponent.prototype.validationCallback = function (e) {
        return true;
    };
    ProductFormComponent.prototype.validateControls = function (mapType) {
        /*
        *  505	502	Herb
           506	502	Manufacturer Herbal
           507	502	Spoon
           508	502	Bag
           509	502	Envelope
           510	502	Sachet
           511	502	Stamp
        *
        */
        this.productTypeValidator.validationRules = [{ type: 'required', message: 'Product type is required.' }];
        this.australianApprovedValidator.validationRules = [{ type: 'stringLength', max: "200", message: 'Australian Approved Name can be at most 200 characters.' }];
        this.natureValidator.validationRules = [{ type: 'stringLength', max: "200", message: 'Nature/Flavour can be at most 200 characters.' }];
        this.channelValidator.validationRules = [{ type: 'stringLength', max: "200", message: 'Channels can be at most 200 characters.' }];
        this.rawDoseRangeValidator.validationRules = [{ type: 'stringLength', max: "200", message: 'Raw Dose Range can be at most 200 characters.' }];
        this.uoMValidator.validationRules = [{ type: 'required', message: 'Unit is required.' }];
        //herb
        if (mapType == 0 || mapType == 505) {
            this.pinYinNameValidator.validationRules =
                [{ type: 'required', message: 'Pin Yin name is required.' },
                    { type: 'stringLength', max: "200", message: 'Pin yin Name can be at most 200 characters.' }];
            this.productNameValidator.validationRules =
                [{ type: 'required', message: this.productName + ' is required.' },
                    { type: 'stringLength', max: "200", message: this.productName + ' can be at most 200 characters.' }];
            this.pharmaceuticalValidator.validationRules =
                [{ type: 'required', message: 'Pharmaceutical Name is required.' },
                    { type: 'stringLength', max: "200", message: 'Pharmaceutical Name can be at most 200 characters.' }];
            this.herbTypeValidator.validationRules = [{ type: 'required', message: 'Herb Type is required.' }];
            this.herbRatioValidator.validationRules = [{ type: 'required', message: 'Herb Ratio is required.' }];
        }
        //manufacture herbal
        else if (mapType == 506) {
            this.pinYinNameValidator.validationRules =
                [{ type: 'required', message: 'Pin Yin name is required.' },
                    { type: 'stringLength', max: "200", message: 'Pin yin Name can be at most 200 characters.' }];
            this.productNameValidator.validationRules =
                [{ type: 'required', message: this.productName + ' is required.' },
                    { type: 'stringLength', max: "200", message: this.productName + ' can be at most 200 characters.' }];
            this.pharmaceuticalValidator.validationRules =
                [{ type: 'required', message: 'Pharmaceutical Name is required.' },
                    { type: 'stringLength', max: "200", message: 'Pharmaceutical Name can be at most 200 characters.' }];
            this.herbTypeValidator.validationRules = [{ type: 'custom', validationCallback: this.validationCallback, }];
            this.herbRatioValidator.validationRules = [{ type: 'custom', validationCallback: this.validationCallback, }];
        }
        //spoon, bag, sachet, stamp
        else {
            this.pinYinNameValidator.validationRules = [{ type: 'custom', validationCallback: this.validationCallback, }];
            this.productNameValidator.validationRules =
                [{ type: 'required', message: this.productName + ' is required.' },
                    { type: 'stringLength', max: "200", message: this.productName + ' can be at most 200 characters.' }];
            this.pharmaceuticalValidator.validationRules = [{ type: 'custom', validationCallback: this.validationCallback, }];
            this.herbTypeValidator.validationRules = [{ type: 'custom', validationCallback: this.validationCallback, }];
            this.herbRatioValidator.validationRules = [{ type: 'custom', validationCallback: this.validationCallback, }];
        }
    };
    /**
     * Init method
     **/
    ProductFormComponent.prototype.init = function () {
        var _this = this;
        this.productService.getProduct(this.productId).toPromise().then(function (response) {
            _this.herbTypeSelectItems = response.result.herbTypeSelectItems,
                _this.supplierSelectItems = response.result.supplierSelectItems,
                _this.uoMSelectItems = response.result.uoMSelectItems,
                _this.productTypeSelectItems = response.result.productTypeSelectItems,
                _this.herbRatioSelectItems = response.result.herbRatioSelectItems,
                _this.subCategorySelectItems = response.result.subCategorySelectItems,
                _this.subCategorySelectedItem = _this.productDataSource.subCategoryItems,
                _this.productDataSource = response.result.product,
                _this.photoDataSource = _this.productDataSource.thumbnail,
                _this.imageUploadControl.setEntityValue(_this.photoDataSource),
                _this.titlebar.initializeToolbar(_this.productId == 0 ? "Product: New" : "Product: " + _this.productDataSource.pinYinName, null, _this.toolbarType),
                _this.initializeProductCategory();
        });
    };
    ProductFormComponent.prototype.initializeProductCategory = function () {
        // iterate over each element in the array
        for (var i = 0; i < this.subCategorySelectItems.length; i++) {
            for (var j = 0; j < this.productDataSource.subCategoryItems.length; j++) {
                if (this.subCategorySelectItems[i].id == this.productDataSource.subCategoryItems[j]) {
                    //add to the targetted array
                    this.target.push(this.subCategorySelectItems[i]);
                }
            }
        }
    };
    /**
     *
     * @param closedWindow
     * @param isNew
     */
    ProductFormComponent.prototype.saveEntity = function (action) {
        var _this = this;
        this.productDataSource.subCategorySelectedItem = this.target;
        if (this.productId == 0) {
            this.productService.createProduct(this.imageUploadControl.fileName, this.productDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been saved successfully", 'Information');
                _this.entityModel.entityId = data.result;
                _this.productDataSource.id = _this.entityModel.entityId;
                _this.productId = data.result;
                _this.redirectToListPage(action);
            });
        }
        else {
            this.productService.updateProduct(this.imageUploadControl.fileName, this.productDataSource).subscribe(function (data) {
                _this.messageService.success("Record has been updated successfully", 'Information');
                _this.entityModel.entityId = data.result;
                _this.imageUploadControl.photoDataSource.isUpdated = false;
                _this.redirectToListPage(action);
            });
        }
    };
    /**
     * validate and save data
     */
    ProductFormComponent.prototype.validateAndSave = function (action) {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    };
    /**
    * redirect to list page
    */
    ProductFormComponent.prototype.redirectToListPage = function (action) {
        var newNavigationUrl = '/ims/product';
        if (action == utilities_1.DetailPageAction.Close || action == utilities_1.DetailPageAction.SaveAndClose) {
            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == utilities_1.DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.productId, this.router.url);
        }
    };
    __decorate([
        core_1.Input()
    ], ProductFormComponent.prototype, "entityModel", void 0);
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], ProductFormComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild('imgUploadControl')
    ], ProductFormComponent.prototype, "imageUploadControl", void 0);
    __decorate([
        core_1.ViewChild('formValidation')
    ], ProductFormComponent.prototype, "formValidation", void 0);
    __decorate([
        core_1.ViewChild('cboProductType')
    ], ProductFormComponent.prototype, "cboProductType", void 0);
    __decorate([
        core_1.ViewChild('txtPinYinName')
    ], ProductFormComponent.prototype, "txtPinYinName", void 0);
    __decorate([
        core_1.ViewChild('txtPharmacetual')
    ], ProductFormComponent.prototype, "txtPharmacetual", void 0);
    __decorate([
        core_1.ViewChild('txtAustralianApprovedName')
    ], ProductFormComponent.prototype, "txtAustralianApprovedName", void 0);
    __decorate([
        core_1.ViewChild('txtNature')
    ], ProductFormComponent.prototype, "txtNature", void 0);
    __decorate([
        core_1.ViewChild('txtChannels')
    ], ProductFormComponent.prototype, "txtChannels", void 0);
    __decorate([
        core_1.ViewChild('txtRawDoseRange')
    ], ProductFormComponent.prototype, "txtRawDoseRange", void 0);
    __decorate([
        core_1.ViewChild('txtPremiumHerb')
    ], ProductFormComponent.prototype, "txtPremiumHerb", void 0);
    __decorate([
        core_1.ViewChild('chkToxic')
    ], ProductFormComponent.prototype, "chkToxic", void 0);
    __decorate([
        core_1.ViewChild('txtToxicWarning')
    ], ProductFormComponent.prototype, "txtToxicWarning", void 0);
    __decorate([
        core_1.ViewChild('txtMinimumSellingQtyPerBag')
    ], ProductFormComponent.prototype, "txtMinimumSellingQtyPerBag", void 0);
    __decorate([
        core_1.ViewChild('cboHerbType')
    ], ProductFormComponent.prototype, "cboHerbType", void 0);
    __decorate([
        core_1.ViewChild('cboHerbRatio')
    ], ProductFormComponent.prototype, "cboHerbRatio", void 0);
    __decorate([
        core_1.ViewChild('productTypeValidator')
    ], ProductFormComponent.prototype, "productTypeValidator", void 0);
    __decorate([
        core_1.ViewChild('pinYinNameValidator')
    ], ProductFormComponent.prototype, "pinYinNameValidator", void 0);
    __decorate([
        core_1.ViewChild('productNameValidator')
    ], ProductFormComponent.prototype, "productNameValidator", void 0);
    __decorate([
        core_1.ViewChild('pharmaceuticalValidator')
    ], ProductFormComponent.prototype, "pharmaceuticalValidator", void 0);
    __decorate([
        core_1.ViewChild('australianApprovedValidator')
    ], ProductFormComponent.prototype, "australianApprovedValidator", void 0);
    __decorate([
        core_1.ViewChild('natureValidator')
    ], ProductFormComponent.prototype, "natureValidator", void 0);
    __decorate([
        core_1.ViewChild('channelValidator')
    ], ProductFormComponent.prototype, "channelValidator", void 0);
    __decorate([
        core_1.ViewChild('rawDoseRangeValidator')
    ], ProductFormComponent.prototype, "rawDoseRangeValidator", void 0);
    __decorate([
        core_1.ViewChild('herbTypeValidator')
    ], ProductFormComponent.prototype, "herbTypeValidator", void 0);
    __decorate([
        core_1.ViewChild('herbRatioValidator')
    ], ProductFormComponent.prototype, "herbRatioValidator", void 0);
    __decorate([
        core_1.ViewChild('uoMValidator')
    ], ProductFormComponent.prototype, "uoMValidator", void 0);
    ProductFormComponent = __decorate([
        core_1.Component({
            selector: 'app-product-form',
            templateUrl: './product-form.component.html',
            styleUrls: ['./product-form.component.scss']
        })
    ], ProductFormComponent);
    return ProductFormComponent;
}());
exports.ProductFormComponent = ProductFormComponent;
//# sourceMappingURL=product-form.component.js.map
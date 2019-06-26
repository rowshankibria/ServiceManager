import { Component, AfterViewInit, ViewChild, Inject, Input } from '@angular/core';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule, DxTextBoxModule, DxCheckBoxModule, DxValidatorModule, DxValidationGroupComponent, DxColorBoxComponent, DxTreeListComponent, DxTreeListModule, DxFileUploaderComponent, DxValidatorComponent, DxSelectBoxComponent, DxTextAreaComponent, DxTagBoxComponent, DxRadioGroupComponent, DxDropDownBoxComponent, DxDataGridComponent, DxTextBoxComponent, DxCheckBoxComponent, DxNumberBoxComponent } from 'devextreme-angular';
import { MessageService } from './../../../../shared/services/message.service'
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ImageUploadComponent } from './../../../application-shared/components/common/image-upload.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToolbarType, DetailPageAction, PatterMatch } from './../../../application-shared/components/titlebar/utilities';
import { retry, max } from 'rxjs/operators';
import { RoleService } from './../../../system-settings/services/role.service';
import { UserService } from './../../../system-settings/services/user.service';
import DataSource from 'devextreme/data/data_source';
import CustomStore from "devextreme/data/custom_store";
import { HttpClient, HttpClientModule, HttpParams } from "@angular/common/http";
import { ToolbarItem, ToolbarItemOption } from '../../../application-shared/components/titlebar/toolbar-item';
import { EntityModel } from '../../../system-service/models/entityModel';
import { ProductService } from '../../services/product.service';
import { NavigationService } from './../../../../shared/services/navigation.service';
import "rxjs/add/operator/toPromise";
import { DualListComponent } from 'angular-dual-listbox';
declare var $: any;

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss']
})

export class ProductFormComponent implements AfterViewInit {

    @Input() entityModel: EntityModel = new EntityModel();
    entityId: number = 0;
    productId: number = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    productName: any = "English Name";

    toolbarAdditionalItems: ToolbarItem[];
    contentClass: any = "detail-page-content-div";

    showItem: any = "row form-group item-visible";
    showGroup: any = "card mb-1 item-visible";
    hideItem: any = "row form-group item-invisible";
    hideGroup: any = "card mb-1 item-invisible";

    herbTypeClass: any = this.showItem;
    herbTypeNonManufactureClass: any = this.showItem;
    herbTypeClassGroup: any = this.showGroup;
    manufacturedClassGroup: any = this.hideGroup;

    key: string = 'id';
    display: string = 'name';
    format = { add: 'Assign Category(s)', remove: 'Unassign Category(s)', all: 'All', none: 'None', direction: 'left-to-right', draggable: true, locale: undefined };

    productDataSource: any = [];
    photoDataSource: any = [];

    herbTypeSelectItems: any = [];
    supplierSelectItems: any = [];
    uoMSelectItems: any = [];
    productTypeSelectItems: any = [];
    herbRatioSelectItems: any = [];
    subCategorySelectItems: any = [];
    subCategorySelectedItem: any = [];
    target: any = [];


    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('imgUploadControl')
    private imageUploadControl: ImageUploadComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild('cboProductType')
    private cboProductType: DxSelectBoxComponent;

    @ViewChild('txtPinYinName')
    private txtPinYinName: DxTextBoxComponent;

    @ViewChild('txtPharmacetual')
    private txtPharmacetual: DxTextBoxComponent;

    @ViewChild('txtAustralianApprovedName')
    private txtAustralianApprovedName: DxTextBoxComponent;

    @ViewChild('txtNature')
    private txtNature: DxTextBoxComponent;

    @ViewChild('txtChannels')
    private txtChannels: DxTextBoxComponent;

    @ViewChild('txtRawDoseRange')
    private txtRawDoseRange: DxTextBoxComponent;

    @ViewChild('txtPremiumHerb')
    private txtPremiumHerb: DxNumberBoxComponent;

    @ViewChild('chkToxic')
    private chkToxic: DxCheckBoxComponent;

    @ViewChild('txtToxicWarning')
    private txtToxicWarning: DxNumberBoxComponent;

    @ViewChild('txtMinimumSellingQtyPerBag')
    private txtMinimumSellingQtyPerBag: DxNumberBoxComponent;

    @ViewChild('cboHerbType')
    private cboHerbType: DxSelectBoxComponent;

    @ViewChild('cboHerbRatio')
    private cboHerbRatio: DxSelectBoxComponent;


    /******************** Validator Component *******************/

    @ViewChild('productTypeValidator')
    private productTypeValidator: DxValidatorComponent;

    @ViewChild('pinYinNameValidator')
    private pinYinNameValidator: DxValidatorComponent;

    @ViewChild('productNameValidator')
    private productNameValidator: DxValidatorComponent;

    @ViewChild('pharmaceuticalValidator')
    private pharmaceuticalValidator: DxValidatorComponent;

    @ViewChild('australianApprovedValidator')
    private australianApprovedValidator: DxValidatorComponent;

    @ViewChild('natureValidator')
    private natureValidator: DxValidatorComponent;

    @ViewChild('channelValidator')
    private channelValidator: DxValidatorComponent;

    @ViewChild('rawDoseRangeValidator')
    private rawDoseRangeValidator: DxValidatorComponent;

    @ViewChild('herbTypeValidator')
    private herbTypeValidator: DxValidatorComponent;

    @ViewChild('herbRatioValidator')
    private herbRatioValidator: DxValidatorComponent;

    @ViewChild('uoMValidator')
    private uoMValidator: DxValidatorComponent;




    /*********************************************** Event Start ****************************************/

    /**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    constructor(private productService: ProductService,
        private messageService: MessageService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router) {


        this.route.params.subscribe(params => {
            if (params['productId'] !== undefined) {
                this.productId = params['productId'];
                this.toolbarType = ToolbarType.DetailTabPage;
                this.contentClass = "detail-page-content-div-tab";
            }
        });
    }

    /**
     * Event
     **/
    ngAfterViewInit(): void {
        //this.formValidation.instance.validate();
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
     * on value change for numeric control
     */ 
    onNumericControlValueChanged(e) {
        //debugger;
        let value = e.value;
        if (value == null) {
            //e.component.option("value", 0);
            e.value = 0;
        }
    }

    /*
    * on product type value changed
    */
    onProductTypeValueChanged(e): void {
        let value = e.value;
        this.configureControlsUI(this.getProductTypeMap(value));
        if (e.previousValue != undefined && e.previousValue != null) {            
            this.resetControls();
        }
    }

    /**
     * get product map type
     * @param value
     */
    getProductTypeMap(value): any {
        let mapType = 0;

        // iterate over each element in the array
        for (var i = 0; i < this.productTypeSelectItems.length; i++) {

            if (this.productTypeSelectItems[i].id == value) {
                //add to the targetted array
                mapType = this.productTypeSelectItems[i].tag;
            }
        }

        return mapType;
    }

    configureControlsUI(mapType): void {

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
    }

    /**
     * reset control when switch to different product type
     * */
    resetControls(): void {

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

    }

    /**
     * attach validation to the controls
     *
     * */
    attachValidationToControl() {
        let mapType = 0;
        let productTypeValue = this.cboProductType.value;
        mapType = this.getProductTypeMap(productTypeValue);
        this.validateControls(mapType);
    }

    validationCallback(e) {
        return true;
    }

    validateControls(mapType): void {

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
    }

    /**
     * Init method
     **/
    init(): void {

        this.productService.getProduct(this.productId).toPromise().then((response: any) => {

            this.herbTypeSelectItems = response.result.herbTypeSelectItems,
                this.supplierSelectItems = response.result.supplierSelectItems,
                this.uoMSelectItems = response.result.uoMSelectItems,
                this.productTypeSelectItems = response.result.productTypeSelectItems,
                this.herbRatioSelectItems = response.result.herbRatioSelectItems,
                this.subCategorySelectItems = response.result.subCategorySelectItems,

                this.subCategorySelectedItem = this.productDataSource.subCategoryItems,
                this.productDataSource = response.result.product,
                this.photoDataSource = this.productDataSource.thumbnail,
                this.imageUploadControl.setEntityValue(this.photoDataSource),
                this.titlebar.initializeToolbar(this.productId == 0 ? "Product: New" : "Product: " + this.productDataSource.pinYinName, null, this.toolbarType),
                this.initializeProductCategory();

        });
    }

    initializeProductCategory(): void {

        // iterate over each element in the array
        for (var i = 0; i < this.subCategorySelectItems.length; i++) {

            for (var j = 0; j < this.productDataSource.subCategoryItems.length; j++) {
                if (this.subCategorySelectItems[i].id == this.productDataSource.subCategoryItems[j]) {
                    //add to the targetted array
                    this.target.push(this.subCategorySelectItems[i]);
                }
            }
        }

    }

    /**
     * 
     * @param closedWindow
     * @param isNew
     */
    saveEntity(action: DetailPageAction): void {

        this.productDataSource.subCategorySelectedItem = this.target;

        if (this.productId == 0) {
            this.productService.createProduct(this.imageUploadControl.fileName, this.productDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.entityModel.entityId = data.result;
                this.productDataSource.id = this.entityModel.entityId;
                this.productId = data.result;
                this.redirectToListPage(action);                
            });
        }
        else {
            this.productService.updateProduct(this.imageUploadControl.fileName, this.productDataSource).subscribe(data => {
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
    * redirect to list page
    */
    redirectToListPage(action: DetailPageAction): void {
        
        var newNavigationUrl = '/ims/product';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.productId, this.router.url);
        }

    }
}

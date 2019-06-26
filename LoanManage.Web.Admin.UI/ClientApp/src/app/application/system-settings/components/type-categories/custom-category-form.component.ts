import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule, DxTextBoxModule, DxCheckBoxModule, DxValidatorModule, DxValidationGroupComponent, DxValidatorComponent } from 'devextreme-angular';
import { MessageService } from './../../../../shared/services/message.service'
import { NavigationService } from './../../../../shared/services/navigation.service'
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TypeAndCategoryService } from './../../../system-settings/services/type-and-category.service';
import { ToolbarType, DetailPageAction } from './../../../application-shared/components/titlebar/utilities';
import { retry } from 'rxjs/operators';
import { debug } from 'util';

@Component({
    selector: '.app-custom-category-form',
    templateUrl: './custom-category-form.component.html',
    styleUrls: ['./custom-category-form.component.scss'],
})

export class CustomCategoryFormComponent implements AfterViewInit {

    customCategory: any = {};
    customCategoryType: any = {};
    businessProfileSelectItems: any = [];
    mapTypeSelectItems: any = [];
    parentSelectItems: any = [];
    categoryId: number = 0;
    categoryTypeKey: string = "";
    entityName: string = "";
    showMapType: boolean = true;
    mapOption: any = null;
    entityType: number = 0;        
    disabledDefaultCheckbox = false;

    enabledColor: boolean = false;
    enabledParent: boolean = true;

    mapTypeStyle: string = 'row form-group item-invisible';
    contentClass: any = "detail-page-content-div";

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild('nameValidation')
    private nameValidation: DxValidatorComponent;

    @ViewChild('mapTypeOptionValidation')
    private mapTypeOptionValidation: DxValidatorComponent;

    constructor(private customCategoryservice: TypeAndCategoryService,
        private messageService: MessageService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router) {

        this.categoryId = 0;

    }

    ngAfterViewInit(): void {

    }

    ngOnInit(): void {
        
        this.route.params.subscribe((params: Params) => {            
            if (params['routingKey'] !== undefined) {
                this.categoryTypeKey = params['routingKey'];
            }

            if (params['id'] != undefined) {
                this.categoryId = params['id'];
            }
             
        });

        this.init();
    }


    init(): void {

        this.titlebar.initializeToolbar("", null, ToolbarType.DetailPage);
        this.setDatasource();
    }

    setDatasource(): void {

        this.customCategoryservice.getCustomCategoryById(this.categoryId, this.categoryTypeKey, 0).subscribe(data => {

            this.customCategoryType = data.result.customCategoryType;
            this.customCategory = data.result.customCategory;       
            this.mapTypeSelectItems = data.result.mapTypeSelectItems;
            this.disabledDefaultCheckbox = this.customCategory.isDefault;

            if (this.categoryId > 0) {
                this.titlebar.setToolbarTitle(this.customCategoryType.name + ": " + this.customCategory.name)
            }
            else {
                this.titlebar.setToolbarTitle(this.customCategoryType.name + ": New")
            }
            this.attachValidationToControl();
        });
    }


    attachValidationToControl() {
       
        //validation   
        this.nameValidation.validationRules = [{ type: 'required', message: 'Name is required.' }];

        this.mapTypeOptionValidation.validationRules = [{ type: 'custom', validationCallback: this.validationCallback, message: '' }];
        
        if (this.customCategoryType.customCategoryMapTypeId > 0) {
            this.mapTypeStyle = 'row form-group item-visible';
            if (this.customCategoryType.isMapTypeRequired) {
                this.mapTypeOptionValidation.validationRules = [{ type: 'required', message: 'Map Type is required' }];
            }
        }
    }

    validationCallback() {
        
        return true;
    }

    saveEntity(action: DetailPageAction): void {        
        if (this.categoryId == 0 || this.categoryId == null) {
            this.customCategoryservice.createEntity(this.customCategory).subscribe(data => {                
                this.categoryId = data.result;                             
                this.messageService.success("Record has been save successfully", 'Information');
                this.redirectToListPage(action);
            });
        } else {
            this.customCategoryservice.updateEntity(this.categoryId, this.customCategory).subscribe(data => {                
                this.messageService.success("Record has been save successfully", 'Information');
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

    onCloseClicked(): void {

        this.redirectToListPage(DetailPageAction.Close);
    }

    /**
    * redirect to list page
    */
    redirectToListPage(action: DetailPageAction): void {
        
        var newNavigationUrl = '/system-settings/type-and-category/' + this.categoryTypeKey ;

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {

            if (newNavigationUrl + '/new' == this.router.url) {

                this.categoryId = 0;
                this.setDatasource();
            }
            else {
                this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/new', this.router.url);
            }
        }
        else if (action == DetailPageAction.Save &&  newNavigationUrl + '/new' == this.router.url) {
            
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.categoryId, this.router.url);
        }
    }

    defaultValueChanged(e: any):void {
        if (e.value) {
            this.customCategory.isActive = true;
        }
    }

   
}

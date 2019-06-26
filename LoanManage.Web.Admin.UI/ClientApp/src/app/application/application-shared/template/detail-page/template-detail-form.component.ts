import { Component, ViewChild, AfterContentChecked, Input, OnInit } from '@angular/core';
import { DxFormModule, DxTextBoxModule, DxSelectBoxModule, DxCheckBoxModule, DxValidatorModule, DxValidationGroupComponent, DxValidatorComponent } from 'devextreme-angular';
import { MessageService } from './../../../../shared/services/message.service'
import { NavigationService } from './../../../../shared/services/navigation.service'
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TypeAndCategoryService } from './../../../system-settings/services/type-and-category.service';
import { ToolbarType, DetailPageAction } from './../../../application-shared/components/titlebar/utilities';
import { retry } from 'rxjs/operators';
import { debug } from 'util';
import { IDetailPage } from './../../../application-shared/interfaces'
import { DetailFormService } from './../../template/services/detail-form.service'


@Component({
    selector: 'template-detail-form',
    templateUrl: './template-detail-form.component.html',
    styleUrls: ['./template-detail-form.component.scss']
})

export class TemplateDetailFormComponent implements OnInit, AfterContentChecked, IDetailPage {

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @Input() recordId = 0;
    paramKey = 'id'; //set param key
    formTitle = ''; // set form
    formDataSource: any = [];
    disabledDefaultCheckbox = false;
    isDefaultBusinessProfileUser = false;
    disabledInUpdateMode = true;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    contentClass: any = "detail-page-content-div";
    
    constructor(private detailFormService: DetailFormService,
        private messageService: MessageService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router) {

        this.route.params.subscribe(params => {
            if (params[this.paramKey] !== undefined) {
                this.recordId = params[this.paramKey];
                this.toolbarType = ToolbarType.DetailPage;
                //this.contentClass = "detail-page-content-div-tab";
            }
        });
    }

    ngOnInit(): void {
        this.init();        
    }

    init(): any {
        this.detailFormService.getRecordInfoById(this.recordId).toPromise().then((response: any) => {
            this.formDataSource = response.result;//set property
            this.disabledDefaultCheckbox = this.formDataSource.isDefault;
            this.isDefaultBusinessProfileUser = response.result.isDefaultBusinessProfile;
            this.titlebar.initializeToolbar(this.recordId == 0 ? this.formTitle + ": New" : this.formTitle + ": " + this.formDataSource.name, null, this.toolbarType);
        });
    }

    ngAfterContentChecked(): void {
        this.disabledInUpdateMode = this.recordId > 0 && this.isDefaultBusinessProfileUser;
    }

    saveEntity(action: DetailPageAction): void {

        if (this.recordId == 0) {
            this.detailFormService.createRecord(this.formDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');

                this.recordId = data.result;//Set Record Id
                this.formDataSource.id = this.recordId;
                this.redirectToListPage(action);

            });
        }
        else {
            this.detailFormService.updateRecord(this.recordId, this.formDataSource).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');                
                this.redirectToListPage(action);
            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        var newNavigationUrl = '';//set newNavigationUrl

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.recordId, this.router.url);
        }
        else {
            this.titlebar.setToolbarTitle(this.formTitle + ": " + this.formDataSource.displayName);
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
        this.redirectToListPage(DetailPageAction.Close);
    }

}

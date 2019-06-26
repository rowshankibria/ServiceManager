import { Component, AfterViewInit, ViewChild, AfterContentChecked, Input } from '@angular/core';
import { DxSelectBoxModule, DxFormModule, DxNumberBoxModule, DxTextBoxModule, DxCheckBoxModule, DxValidatorModule, DxValidationGroupComponent, DxValidatorComponent } from 'devextreme-angular';
import { MessageService } from './../../../../../../shared/services/message.service'
import { NavigationService } from './../../../../../../shared/services/navigation.service'
import { TitlebarComponent } from './../../../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TypeAndCategoryService } from './../../../../../system-settings/services/type-and-category.service';
import { ToolbarType, DetailPageAction, PatterMatch } from './../../../../../application-shared/components/titlebar/utilities';
import { retry } from 'rxjs/operators';
import { debug } from 'util';
import { IDetailPage } from './../../../../../application-shared/interfaces'
import { EmailServerService } from '../../../../services/email-server.service';


@Component({
    selector: 'app-email-server-form',
    templateUrl: './email-server-form.component.html',
    styleUrls: ['./email-server-form.component.scss']
})
/** email-server-form component*/
export class EmailServerFormComponent implements AfterContentChecked, IDetailPage {

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @Input() recordId = 0;
    paramKey = 'id';
    formTitle = 'Email Server';
    formDataSource: any = [];
    disabledDefaultCheckbox = false;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    contentClass: any = "detail-page-content-div";
    


    disabledInUpdateMode = false;
    isDefaultBusinessProfileUser = false;
    businessProfileDataSource: any = [];
    protocolDataSource: any = [];
    senderOptionDataSource: any = [];
    authenticationTypeDataSource: any = [];

    emailPattern: any = PatterMatch.EmailPattern;

    constructor(private detailService: EmailServerService,
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
        this.detailService.getRecordInfoById(this.recordId).toPromise().then((response: any) => {
            
            this.formDataSource = response.result.serverSetting;
            
            this.businessProfileDataSource = response.result.businessProfileSelectItems;
            this.protocolDataSource = response.result.protocolSelectItems;
            this.senderOptionDataSource = response.result.senderOptionSelectItems;
            this.authenticationTypeDataSource = response.result.authenticationTypeSelectItems;

            this.disabledDefaultCheckbox = this.formDataSource.isDefault;

            this.isDefaultBusinessProfileUser = response.result.isDefaultBusinessProfile;

            ////set value null for select box box value
            //if (this.recordId < 1) {
            //    this.formDataSource.authenticationTypeId = null;
            //    this.formDataSource.protocolId = null;
            //    this.formDataSource.senderOptionId = null;
            //}

            this.titlebar.initializeToolbar(this.recordId == 0 ? this.formTitle + ": New" : this.formTitle + ": " + this.formDataSource.displayName, null, this.toolbarType);
        });
    }

    ngAfterContentChecked(): void {
        this.disabledInUpdateMode = this.recordId > 0 && this.isDefaultBusinessProfileUser;
    }

    saveEntity(action: DetailPageAction): void {

        if (this.recordId == 0) {
            this.detailService.createRecord(this.formDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');

                this.recordId = data.result;
                this.formDataSource.id = this.recordId;
                this.redirectToListPage(action);

            });
        }
        else {
            this.detailService.updateRecord(this.recordId, this.formDataSource).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');                
                this.redirectToListPage(action);
            });
        }
    }
    redirectToListPage(action: DetailPageAction): void {
        var newNavigationUrl = 'system-settings/system-configuration/email-server';

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

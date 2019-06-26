import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule, DxNumberBoxModule, DxTextBoxModule, DxCheckBoxModule, DxValidatorModule, DxValidationGroupComponent, DxColorBoxComponent, DxRadioGroupComponent, DxRadioGroupModule, DxValidatorComponent } from 'devextreme-angular';
import { MessageService } from './../../../../../shared/services/message.service'
import { TitlebarComponent } from './../../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SystemConfigurationService } from './../../../../system-settings/services/system-configuration.service';
import { retry } from 'rxjs/operators';
import { ToolbarType } from './../../../../application-shared/components/titlebar/utilities';

@Component({
    selector: 'app-security-configuration',
    templateUrl: './security-configuration.component.html',
    styleUrls: ['./security-configuration.component.scss']
})

export class SecurityConfigurationComponent implements AfterViewInit {


    securityConfiguration: any = {};
    authenticationTypeSelectItems: any = [];
    userNameTypeSelectItems: any = [];

    categoryId: any = "";
    entityName: string = "";
    isRequired: boolean = false;
    mapOption: any = null;
    entityType: number = 0;
    contentClass: any = "detail-page-content-div";

    enabledColor: boolean = false;
    enabledParent: boolean = true;

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild('authenticationValidation')
    private authValidation: DxValidatorComponent;


    constructor(private configuration: SystemConfigurationService,
        private messageService: MessageService, private route: ActivatedRoute,
        private router: Router) {

    }

    /**
     *ngAfterViewInit Event
     * */
    ngAfterViewInit(): void {

        this.attachValidationToControl();
    }

    /**
     *ngOnInit Event
     * */
    ngOnInit(): void {

        this.init();

    }

    /**
     * init method which calls service method
     * */
    init(): void {
        this.configuration.getDefaultSecurityConfiguration().subscribe(data => {
            this.securityConfiguration = data.result.securityConfiguration,
                this.titlebar.initializeToolbar("Security Configuration", null, ToolbarType.DetailTabPage),
                this.authenticationTypeSelectItems = data.result.authenticationTypeSelectItems,
                this.userNameTypeSelectItems = data.result.userNameTypeSelectItems,
                this.contentClass = "detail-page-content-div-tab";
        });
    }

    /**
     * attach validation to the controls
     *
     * */
    attachValidationToControl() {

        //validation
        this.authValidation.validationRules = [{ type: 'required', message: 'Authentication is required.' }];
    }

    /**
     * save entity data to db
     * @param closedWindow
     * @param isNew
     */
    saveEntity(closedWindow: boolean, isNew: boolean): void {
        this.configuration.updateEntity(this.securityConfiguration).subscribe(data => {
            this.messageService.success("Record has been save successfully", 'Information');
            this.redirectToListPage(data.result, closedWindow, isNew);
        });
    }


    /**
     * validate and save data
     */
    validateAndSave(closedWindow: boolean, isNew: boolean): void {

        this.formValidation.instance.validate();

        if (!this.formValidation.instance.validate().isValid) {
            return;
        }

        this.saveEntity(closedWindow, isNew);
    }

    /**
     * on save button clicked
     */
    onSaveClicked(e): void {

        this.validateAndSave(false, false);
    }

    /**
     * on save and new button clicked
     */
    onSaveNNewClicked(): void {

        this.validateAndSave(false, true);
    }

    /**
     * on save and close button clicked
     */
    onSaveNCloseClicked(): void {

        this.validateAndSave(true, false);
    }

    /**
    * redirect to link page
    */
    redirectToListPage(id: any, closedWindow: boolean, isNew: boolean): void {

        if (closedWindow) {
            this.router.navigate(['/system-settings/configurations-menu']);
        }
    }

    /**
     * on close button clicked
     */
    onCloseClicked(): void {
        this.redirectToListPage(null, true, false);
    }

}

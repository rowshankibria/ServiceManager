import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { CompanyService } from './../../services/company.service';
import { MessageService } from './../../../../shared/services/message.service';
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../../application-shared/components/titlebar/utilities';
import { NavigationService } from '../../../../shared/services/navigation.service';
import { EntityModel } from '../../../system-service/models/entityModel';
import { ImageUploadComponent } from '../../../application-shared/components/common/image-upload.component';

@Component({
    selector: 'app-company-form',
    templateUrl: './company-form.component.html',
    styleUrls: ['./company-form.component.scss'],
})

export class CompanyFormComponent implements AfterViewInit, OnInit
{

    @Input() entityModel: EntityModel = new EntityModel();
    entityId: number = 0;
    companyId = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    company: any = {};
    businessProfileSelectItems: any = [];
    counrtySelectItems: any = [];
    organisationTypeSelectItems: any = [];
    preferredContactMethodSelectItems: any = [];
    industrySelectItems: any = [];
    ratingSelectItems: any = [];
    stateSelectItems: any = [];
    relationshipTypeSelectItems: any = [];
    contentClass: any = "detail-page-content-div";
    photoDataSource: any = [];

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;
  

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    constructor(private companyService: CompanyService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router)
    {

        this.route.params.subscribe(params => {
            if (params['companyId'] !== undefined) {
                this.companyId = params['companyId'];
                this.toolbarType = ToolbarType.DetailTabPage;
                this.contentClass = "detail-page-content-div";
            }
        });

        this.route.queryParamMap.subscribe(() => {
        });
    }

    ngOnInit(): void {
        this.init();
    }

    ngAfterViewInit(): void {
    }

    init(): void {
        this.companyService.getCompany(this.companyId).subscribe(data => {
            this.company = data.result.company;
            this.titlebar.initializeToolbar(this.companyId == 0 ? 'Region : New' : " Region : " + data.result.company.companyName, null, ToolbarType.DetailPage);

        });
    }


       validateAndSave(action: DetailPageAction): void {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    }

  
    saveEntity(action: DetailPageAction): void
    {        

        if (this.companyId == 0) {
            this.companyService.createCompany(this.company).subscribe(data =>
            {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.companyId = data.result;               
                this.redirectToListPage(action);

            });
        }
        else {
            this.companyService.updateCompany(this.companyId, this.company).subscribe(data =>
            {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.companyId = data.result;               
                this.redirectToListPage(action);
            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        var newNavigationUrl = '/crm/region';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {
            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.companyId, this.router.url);
        }
    }

    onSaveClicked(e): void {
        this.validateAndSave(DetailPageAction.Save);
    }

    onSaveNNewClicked(e): void {
        this.validateAndSave(DetailPageAction.SaveAndNew);
    }

    onSaveNCloseClicked(e): void {
        this.validateAndSave(DetailPageAction.SaveAndClose);
    }

    onCloseClicked(e): void {
        this.redirectToListPage(DetailPageAction.Close);
    }
}

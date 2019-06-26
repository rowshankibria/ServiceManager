import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { SupplierService } from '../../services/supplier.service';
import { MessageService } from './../../../../shared/services/message.service';
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../../application-shared/components/titlebar/utilities';
import { NavigationService } from '../../../../shared/services/navigation.service';
import { EntityModel } from '../../../system-service/models/entityModel';
import { ImageUploadComponent } from '../../../application-shared/components/common/image-upload.component';

@Component({
    selector: 'app-supplier-form',
    templateUrl: './supplier-form.component.html',
    styleUrls: ['./supplier-form.component.scss'],
})

export class SupplierFormComponent implements AfterViewInit, OnInit {

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

    @ViewChild('imgUploadControl')
    private imageUploadControl: ImageUploadComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    constructor(private supplierService: SupplierService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.route.params.subscribe(params => {
            if (params['companyId'] !== undefined) {
                this.companyId = params['companyId'];
                this.toolbarType = ToolbarType.DetailTabPage;
                this.contentClass = "detail-page-content-div-tab";
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

    onClickNotify(): void {
        if (this.companyId == null) {
            this.supplierService.createCompany(this.company).subscribe(() => {
                this.messageService.success('Company save successfully', 'Company save');
            });
        } else {
            this.supplierService.updateCompany(this.companyId, this.company).subscribe(() => {
                this.messageService.success('Company update successfully', 'Company Update');
            });
        }
    }


    init(): void {
        this.supplierService.getCompany(this.companyId).subscribe(data => {
            this.company = data.result.company;

            this.businessProfileSelectItems = data.result.businessProfileSelectItems;
            this.counrtySelectItems = data.result.counrtySelectItems;
            this.organisationTypeSelectItems = data.result.organisationTypeSelectItems
            this.preferredContactMethodSelectItems = data.result.preferredContactMethodSelectItems;
            this.industrySelectItems = data.result.industrySelectItems;
            this.ratingSelectItems = data.result.ratingSelectItems;
            this.relationshipTypeSelectItems = data.result.relationshipTypeSelectItems;
            this.photoDataSource = data.result.company.logo,
                this.imageUploadControl.setEntityValue(this.photoDataSource),
                this.titlebar.initializeToolbar(this.companyId == 0 ? "Supplier: New" : "Supplier: " + data.result.company.companyName, null, this.toolbarType);

        });
    }


    onBusinessProfileSelectionChanged(e): void {
        if (e.value > 0) {
            this.supplierService.getCompanySelectItems(e.value).subscribe(data => {
                this.organisationTypeSelectItems = data.result.organisationTypeSelectItems;
                this.preferredContactMethodSelectItems = data.result.preferredContactMethodSelectItems;
                this.industrySelectItems = data.result.industrySelectItems;
                this.ratingSelectItems = data.result.ratingSelectItems;
            });
        }
        else {
            this.organisationTypeSelectItems = [];
            this.preferredContactMethodSelectItems = [];
            this.industrySelectItems = [];
            this.ratingSelectItems = [];
        }
    }

    onCountrySelectionChanged(e): void {
        if (e.value > 0) {
            this.supplierService.getStateByCountry(e.value).subscribe(data => {
                this.stateSelectItems = data.result;
            });
        }
        else {
            this.stateSelectItems = [];
        }
    }

    validateAndSave(action: DetailPageAction): void {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    }


    saveEntity(action: DetailPageAction): void {

        this.company.photo = this.imageUploadControl.photoDataSource;
        //this.contactDataSource.contactSpecialisationIds = this.contactSpecialisations;
        //this.contactDataSource.businessProfileIds = this.businessProfileIds;
        //this.contactDataSource.companyIds = this.companyIds;

        //if (this._gridSelectedRowKeys[0] != undefined)
        //    this.contactDataSource.companyId = this._gridSelectedRowKeys[0];

        if (this.companyId == 0) {
            this.supplierService.createCompany(this.company).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.companyId = data.result;
                //this.contactDataSource.id = this.entityModel.entityId;
                this.redirectToListPage(action);

            });
        }
        else {
            this.supplierService.updateCompany(this.companyId, this.company).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.companyId = data.result;
                this.imageUploadControl.photoDataSource.isUpdated = false;
                this.redirectToListPage(action);
            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        var newNavigationUrl = '/crm/supplier';

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

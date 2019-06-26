import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { DxValidationGroupComponent, DxValidatorComponent } from 'devextreme-angular';
import { MessageService } from './../../../../shared/services/message.service';
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../../application-shared/components/titlebar/utilities';
import { NavigationService } from '../../../../shared/services/navigation.service';
import { EntityModel } from '../../../system-service/models/entityModel';
import CustomStore from "devextreme/data/custom_store";
import { DxNumberBoxComponent, DxTextBoxComponent, DxTextAreaComponent, DxSelectBoxComponent, DxButtonComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { BranchService } from '../../services/branch.service';
declare var $: any;

@Component({
    selector: 'app-branch-form',
    templateUrl: './branch-form.component.html',
    styleUrls: ['./branch-form.component.scss'],
})

export class BranchComponent implements OnInit {

    entityTitle: string = "Branch";
    branchId: any = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
  
    branchDataSource: any = [];
    regionItemDataSource: any = [];
    contentClass: any = "detail-page-content-div";

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;    


    constructor(private branchService: BranchService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.route.params.subscribe(params => {
            if (params['branchId'] !== undefined) {
                this.branchId = params['branchId'];
                this.toolbarType = ToolbarType.DetailPage;
                this.contentClass = "detail-page-content-div";                
            }
        });
    }

    ngOnInit(): void {
        this.init();
    }

    ngAfterViewInit(): void {
        //this.formValidation.instance.validate();
        this.attachValidationToControl();
    }

    /**
     * attach validation to the controls
     *
     * */
    attachValidationToControl() {
       
    }

    validationCallback(e) {
        return true;
    }


    init(): void {
        this.branchService.getBranch(this.branchId).subscribe(data => {
            this.branchDataSource = data.result.branchModel,
                this.regionItemDataSource = data.result.regionSelectItems,
                this.titlebar.initializeToolbar(this.branchId == 0 ? (this.entityTitle + " : New") : this.entityTitle + " : " + data.result.branchModel.branchName, null, this.toolbarType)
        });
    }  

   
    validateAndSave(action: DetailPageAction): void {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    }


    saveEntity(action: DetailPageAction): void {
        if (this.branchId == 0) {
            this.branchService.createBranch(this.branchDataSource).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.branchId = data.result;
                this.redirectToListPage(action);                
            });
        }
        else {
            this.branchService.updateBranch(this.branchDataSource).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.branchId = data.result;
                this.redirectToListPage(action);                
            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        //debugger;
        var newNavigationUrl = '/crm/branch';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {
            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.branchId, this.router.url);
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




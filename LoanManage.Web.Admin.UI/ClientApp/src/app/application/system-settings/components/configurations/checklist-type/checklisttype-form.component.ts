import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { DxValidationGroupComponent, DxValidatorComponent } from 'devextreme-angular';
import { ChecklistService } from '../../../services/checklist-type.service';
import { MessageService } from './../../../../../shared/services/message.service';
import { TitlebarComponent } from './../../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../../../application-shared/components/titlebar/utilities';
import { NavigationService } from '../../../../../shared/services/navigation.service';
import { EntityModel } from '../../../../system-service/models/entityModel';
import CustomStore from "devextreme/data/custom_store";
import { DxNumberBoxComponent, DxTextBoxComponent, DxTextAreaComponent, DxSelectBoxComponent, DxDataGridComponent, DxButtonComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
declare var $: any;

@Component({
    selector: 'app-checklist-type-form',
    templateUrl: './checklisttype-form.component.html',
    styleUrls: ['./checklisttype-form.component.scss'],
})

export class ChecklistTypeComponent implements OnInit {
      
    entityTitle: string = "Document Checklist";
    checklistTypeId: any = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    documentChecklistModel: any = []; 

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;  
    

    constructor(private checklistTypeService: ChecklistService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.route.params.subscribe(params => {
            if (params['checklistTypeId'] !== undefined) {
                this.checklistTypeId = params['checklistTypeId'];
                this.toolbarType = ToolbarType.DetailPage;
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


    init(): void {
        this.checklistTypeService.getChecklistType(this.checklistTypeId).subscribe(data => {
            this.documentChecklistModel = data.result.documentChecklistModel,
                this.titlebar.initializeToolbar("Document Checklist", null, this.toolbarType);
        });

        
    }
    

    validateAndSave(action: DetailPageAction): void {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    }


    saveEntity(action: DetailPageAction): void {
        if (this.checklistTypeId == 0) {
            this.checklistTypeService.createChecklistType(this.documentChecklistModel).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.checklistTypeId = data.result;
                this.redirectToListPage(action);                
            });
        }
        else {
            this.checklistTypeService.updateChecklistType(this.documentChecklistModel).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.checklistTypeId = data.result;
                this.redirectToListPage(action);                
            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        //debugger;
        var newNavigationUrl = '/system-settings/configuration/checklist-type';
        var returnNavigationUrl = '/system-settings/configuration/checklist-types';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {
            this.navigationService.navigate(returnNavigationUrl);
        }
        else if (action == DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.checklistTypeId, this.router.url);
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

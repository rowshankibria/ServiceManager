import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { FormulaCategoryService } from '../../../services/formula-category.service';
import { MessageService } from './../../../../../shared/services/message.service';
import { TitlebarComponent } from './../../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../../../application-shared/components/titlebar/utilities';
import { NavigationService } from '../../../../../shared/services/navigation.service';
import { EntityModel } from '../../../../system-service/models/entityModel';
import CustomStore from "devextreme/data/custom_store";
import { DxCheckBoxComponent } from 'devextreme-angular';
import { DxTextBoxComponent } from 'devextreme-angular';
import { DxTextAreaComponent } from 'devextreme-angular';
declare var $: any;

@Component({
    selector: 'app-formula-category-form',
    templateUrl: './formula-category-form.component.html',
    styleUrls: ['./formula-category-form.component.scss'],
})

export class FormulaCategoryComponent implements OnInit {

    @Input() entityModel: EntityModel = new EntityModel();
    entityId: number = 0;
    entityTitle: any = "Formula Category";
    formulaCategoryId = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    formulaCategory: any = [];
    formulaCategoryIds: any = [];
    contentClass: any = "detail-page-content-div";

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    constructor(private formulaCategoryService: FormulaCategoryService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.route.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.formulaCategoryId = params['id'];
                this.toolbarType = ToolbarType.DetailTabPage;
                this.contentClass = "detail-page-content-div-tab";
            }
        });
    }

    ngOnInit(): void {
        this.init();
    }

    ngAfterViewInit(): void {
    }

    onClickNotify(): void {
        if (this.formulaCategoryId == null) {
            this.formulaCategoryService.createFormulaCategory(this.formulaCategory).subscribe(() => {
                this.messageService.success('Formula Category save successfully', 'Formula Category save');
            });
        } else {
            this.formulaCategoryService.updateFormulaCategory(this.formulaCategoryId, this.formulaCategory).subscribe(() => {
                this.messageService.success('Formula Category update successfully', 'Formula Category update');
            });
        }
    }


    init(): void {
        this.formulaCategoryService.getFormulaCategory(this.formulaCategoryId).subscribe(data => {
            this.formulaCategory = data.result.formulaCategory,                        
            this.titlebar.initializeToolbar(this.formulaCategoryId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.result.formulaCategory.name, null, this.toolbarType)
        });
    }

    validateAndSave(action: DetailPageAction): void {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    }


    saveEntity(action: DetailPageAction): void {
        if (this.formulaCategoryId == 0) {
            this.formulaCategoryService.createFormulaCategory(this.formulaCategory).subscribe(data => {                
                this.messageService.success("Record has been saved successfully", 'Information');
                this.formulaCategoryId = data.result;
                this.redirectToListPage(action);

            });
        }
        else {
            this.formulaCategoryService.updateFormulaCategory(this.formulaCategoryId, this.formulaCategory).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.formulaCategoryId = data.result;
                this.redirectToListPage(action);
            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        
        var newNavigationUrl = '/system-settings/configuration/formula-category';
        var returnNavigationUrl = '/system-settings/configuration/formula-categories';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {            
            this.navigationService.navigate(returnNavigationUrl);          
        }
        else if (action == DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.formulaCategoryId, this.router.url);
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

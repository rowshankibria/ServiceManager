import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { FormulaSubCategoryService } from '../../../services/formula-sub-category.service';
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
import DataSource from 'devextreme/data/data_source';
declare var $: any;

@Component({
    selector: 'app-formula-sub-category-form',
    templateUrl: './formula-sub-category-form.component.html',
    styleUrls: ['./formula-sub-category-form.component.scss'],
})

export class FormulaSubCategoryComponent implements OnInit {

    @Input() entityModel: EntityModel = new EntityModel();
    entityId: number = 0;
    entityTitle: any = "Formula Subcategory";
    formulaCategoryId: number = 0;
    formulaSubcategoryId: number = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    formulaSubcategory: any = [];
    formulaSubcategoryIds: any = [];
    contentClass: any = "detail-page-content-div";
    availableHerbDataSource: any = [];

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    constructor(private formulaSubcategoryService: FormulaSubCategoryService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.route.params.subscribe(params => {
            if (params['formulaSubcategoryId'] !== undefined) {
                this.formulaSubcategoryId = params['formulaSubcategoryId'];
                this.toolbarType = ToolbarType.DetailPage;
                this.contentClass = "detail-page-content-div";
            }

            if (params['formulaCategoryId'] !== undefined) {
                this.formulaCategoryId = params['formulaCategoryId'];
            }
        });
    }

    ngOnInit(): void {
        this.init();
    }

    ngAfterViewInit(): void {
    }

    onClickNotify(): void {
        if (this.formulaSubcategoryId == null) {
            this.formulaSubcategoryService.createFormulaSubcategory(this.formulaSubcategory).subscribe(() => {
                this.messageService.success('Formula Subcategory save successfully', 'Formula Subcategory save');
            });
        } else {
            this.formulaSubcategoryService.updateFormulaSubcategory(this.formulaSubcategoryId, this.formulaSubcategory).subscribe(() => {
                this.messageService.success('Formula Subcategory update successfully', 'Formula Subcategory update');
            });
        }
    }


    init(): void {
        this.formulaSubcategoryService.getFormulaSubcategory(this.formulaSubcategoryId).subscribe(data => {
            this.formulaSubcategory = data.result.formulaCategory,
                this.titlebar.initializeToolbar(this.formulaSubcategoryId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.result.formulaCategory.name, null, this.toolbarType)
        });

        this.availableHerbDataSource = new DataSource({
            load: (loadOptions: any) => {
                return this.formulaSubcategoryService.getFormulasBySubcategory(this.formulaSubcategoryId, loadOptions).toPromise().then((response: any) => {
                    return {
                        data: response.result.data,
                        totalCount: response.result.totalCount
                    }

                });
            }
        });
    }

    validateAndSave(action: DetailPageAction): void {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    }


    saveEntity(action: DetailPageAction): void {
        if (this.formulaSubcategoryId == 0) {
            //debugger;
            if (this.formulaCategoryId !== undefined && this.formulaCategoryId > 0)
                this.formulaSubcategory.parentId = this.formulaCategoryId;

            this.formulaSubcategoryService.createFormulaSubcategory(this.formulaSubcategory).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.formulaSubcategoryId = data.result;
                this.redirectToListPage(action);
            });
        }
        else {
            this.formulaSubcategoryService.updateFormulaSubcategory(this.formulaSubcategoryId, this.formulaSubcategory).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.formulaSubcategoryId = data.result;
                this.redirectToListPage(action);
            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        //debugger;
        var newNavigationUrl = '/system-settings/configuration/formula-sub-category/' + this.formulaCategoryId;
        var returnNavigationUrl = '/system-settings/configuration/formula-category/' + this.formulaCategoryId; 

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {
            this.navigationService.navigate(returnNavigationUrl);
        }
        else if (action == DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.formulaSubcategoryId, this.router.url);
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

import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { HerbSubCategoryService } from '../../../services/herb-sub-category.service';
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
    selector: 'app-herb-sub-category-form',
    templateUrl: './herb-sub-category-form.component.html',
    styleUrls: ['./herb-sub-category-form.component.scss'],
})

export class HerbSubCategoryComponent implements OnInit {

    @Input() entityModel: EntityModel = new EntityModel();
    entityId: number = 0;
    entityTitle: any = "Herb Subcategory";
    herbCategoryId: number = 0;
    herbSubcategoryId: number = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    herbSubcategory: any = [];
    herbSubcategoryIds: any = [];
    contentClass: any = "detail-page-content-div";

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    constructor(private herbSubcategoryService: HerbSubCategoryService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.route.params.subscribe(params => {
            if (params['herbSubcategoryId'] !== undefined) {
                this.herbSubcategoryId = params['herbSubcategoryId'];
                this.toolbarType = ToolbarType.DetailPage;
                this.contentClass = "detail-page-content-div";
            }

            if (params['herbCategoryId'] !== undefined) {
                this.herbCategoryId = params['herbCategoryId'];
            }
        });
    }

    ngOnInit(): void {
        this.init();
    }

    ngAfterViewInit(): void {
    }

    onClickNotify(): void {
        if (this.herbSubcategoryId == null) {
            this.herbSubcategoryService.createHerbSubcategory(this.herbSubcategory).subscribe(() => {
                this.messageService.success('Herb Subcategory save successfully', 'Herb Subcategory save');
            });
        } else {
            this.herbSubcategoryService.updateHerbSubcategory(this.herbSubcategoryId, this.herbSubcategory).subscribe(() => {
                this.messageService.success('Herb Subcategory update successfully', 'Herb Subcategory update');
            });
        }
    }


    init(): void {
        this.herbSubcategoryService.getHerbSubcategory(this.herbSubcategoryId).subscribe(data => {
            this.herbSubcategory = data.result.herbCategory,
                this.titlebar.initializeToolbar(this.herbSubcategoryId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.result.herbCategory.name, null, this.toolbarType)
        });
    }

    validateAndSave(action: DetailPageAction): void {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    }


    saveEntity(action: DetailPageAction): void {
        if (this.herbSubcategoryId == 0) {
            //debugger;
            if (this.herbCategoryId !== undefined && this.herbCategoryId > 0)
                this.herbSubcategory.parentId = this.herbCategoryId;

            this.herbSubcategoryService.createHerbSubcategory(this.herbSubcategory).subscribe(data => {
                this.messageService.success("Record has been saved successfully", 'Information');
                this.herbSubcategoryId = data.result;
                this.redirectToListPage(action);
            });
        }
        else {
            this.herbSubcategoryService.updateHerbSubcategory(this.herbSubcategoryId, this.herbSubcategory).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.herbSubcategoryId = data.result;
                this.redirectToListPage(action);
            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        
        var newNavigationUrl = '/system-settings/configuration/herb-sub-category/' + this.herbCategoryId;
        var returnNavigationUrl = '/system-settings/configuration/herb-category/' + this.herbCategoryId; 

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {
            this.navigationService.navigate(returnNavigationUrl);
        }
        else if (action == DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.herbSubcategoryId, this.router.url);
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

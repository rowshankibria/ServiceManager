import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { HerbCategoryService } from '../../../services/herb-category.service';
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
    selector: 'app-herb-category-form',
    templateUrl: './herb-category-form.component.html',
    styleUrls: ['./herb-category-form.component.scss'],
})

export class HerbCategoryComponent implements OnInit {

    @Input() entityModel: EntityModel = new EntityModel();
    entityId: number = 0;
    entityTitle: any = "Herb Category";
    herbCategoryId = 0;
    toolbarType: ToolbarType = ToolbarType.DetailPage;
    herbCategory: any = [];
    herbCategoryIds: any = [];
    contentClass: any = "detail-page-content-div";

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    constructor(private herbCategoryService: HerbCategoryService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.route.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.herbCategoryId = params['id'];
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
        if (this.herbCategoryId == null) {
            this.herbCategoryService.createHerbCategory(this.herbCategory).subscribe(() => {
                this.messageService.success('Herb Category save successfully', 'Herb Category save');
            });
        } else {
            this.herbCategoryService.updateHerbCategory(this.herbCategoryId, this.herbCategory).subscribe(() => {
                this.messageService.success('Herb Category update successfully', 'Herb Category update');
            });
        }
    }


    init(): void {
        this.herbCategoryService.getHerbCategory(this.herbCategoryId).subscribe(data => {
            this.herbCategory = data.result.herbCategory,                        
            this.titlebar.initializeToolbar(this.herbCategoryId == 0 ? (this.entityTitle + ": New") : this.entityTitle + ": " + data.result.herbCategory.name, null, this.toolbarType)
        });
    }

    validateAndSave(action: DetailPageAction): void {
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity(action);
    }


    saveEntity(action: DetailPageAction): void {
        if (this.herbCategoryId == 0) {
            this.herbCategoryService.createHerbCategory(this.herbCategory).subscribe(data => {                
                this.messageService.success("Record has been saved successfully", 'Information');
                this.herbCategoryId = data.result;
                this.redirectToListPage(action);

            });
        }
        else {
            this.herbCategoryService.updateHerbCategory(this.herbCategoryId, this.herbCategory).subscribe(data => {
                this.messageService.success("Record has been updated successfully", 'Information');
                this.herbCategoryId = data.result;
                this.redirectToListPage(action);
            });
        }
    }

    redirectToListPage(action: DetailPageAction): void {
        //debugger;
        var newNavigationUrl = '/system-settings/configuration/herb-category';
        var returnNavigationUrl = '/system-settings/configuration/herb-categories';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {
            this.navigationService.navigate(returnNavigationUrl);
        }
        else if (action == DetailPageAction.SaveAndNew) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {
            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.herbCategoryId, this.router.url);
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

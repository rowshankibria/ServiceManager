import { Component, AfterViewInit } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxTabPanelComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HerbCategoryService } from '../../../services/herb-category.service';
import { EntityModel } from '../../../../system-service/models/entityModel';

@Component({
    selector: 'app-herb-category-detail',
    templateUrl: './herb-category-detail.component.html',
    styleUrls: ['./herb-category-detail.component.scss']
})

export class HerbCategoryDetailComponent implements AfterViewInit{

    tabs: any = [];
    entityModel: EntityModel = new EntityModel();
    herbCategoryId: number = 0;
    tabPageServiceStyle: string = 'tab-item-invisible';
    pagekeyComponent: string = "herb-sub-categories";

    constructor(private route: ActivatedRoute, private router: Router, private herbCategoryService: HerbCategoryService)
    {

        this.route.params.subscribe(params =>
        {
            if (params['id'] != undefined) {
                this.herbCategoryId = params['id'];
            }

        });

        this.entityModel.entityId = this.herbCategoryId;
        this.entityModel.entityType = 505;
        this.initTabs();
    }

    /**
     * initialize tab
     * */
    initTabs(): void
    {
        this.herbCategoryService.getPageDetails(this.herbCategoryId).subscribe(data =>
        {
            this.tabs = data.result.tabItems
        });
    }

    /**
     * Event
     * */
    ngAfterViewInit(): void
    {

        //if it is new mode then hide other tab except primary component
        if (this.herbCategoryId != null && this.herbCategoryId != undefined) {
            this.tabPageServiceStyle = "tab-item-visible";
        }
    }
}

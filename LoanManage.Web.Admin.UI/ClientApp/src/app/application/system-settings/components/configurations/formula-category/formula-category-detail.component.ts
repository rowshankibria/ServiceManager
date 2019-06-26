import { Component, AfterViewInit } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxTabPanelComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityModel } from '../../../../system-service/models/entityModel';
import { FormulaCategoryService } from '../../../services/formula-category.service';


@Component({
    selector: 'app-formula-category-detail',
    templateUrl: './formula-category-detail.component.html',
    styleUrls: ['./formula-category-detail.component.scss']
})

export class FormulaCategoryDetailComponent implements AfterViewInit{

    tabs: any = [];
    entityModel: EntityModel = new EntityModel();
    formulaCategoryId: number = 0;
    tabPageServiceStyle: string = 'tab-item-invisible';
    pagekeyComponent: string = "formula-sub-categories";

    constructor(private route: ActivatedRoute, private router: Router, private formulaCategoryService: FormulaCategoryService)
    {

        this.route.params.subscribe(params =>
        {
            if (params['id'] != undefined) {
                this.formulaCategoryId = params['id'];
            }

        });

        this.entityModel.entityId = this.formulaCategoryId;
        this.entityModel.entityType = 506;
        this.initTabs();
    }

    /**
     * initialize tab
     * */
    initTabs(): void
    {
        this.formulaCategoryService.getPageDetails(this.formulaCategoryId).subscribe(data =>
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
        if (this.formulaCategoryId != null && this.formulaCategoryId != undefined) {
            this.tabPageServiceStyle = "tab-item-visible";
        }
    }
}

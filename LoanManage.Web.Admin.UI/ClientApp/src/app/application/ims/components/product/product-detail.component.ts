import { Component, AfterViewInit } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, DxTabPanelComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { EntityModel } from '../../../system-service/models/entityModel';

@Component({
    selector: '.app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
})

export class ProductDetailComponent implements AfterViewInit {

    tabs: any = [];
    entityModel: EntityModel = new EntityModel();
    productId: number = 0;
    tabPageServiceStyle: string = 'tab-item-invisible';

    constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService) {

        this.route.params.subscribe(params => {
            if (params['productId'] != undefined) {
                this.productId = params['productId'];
            }

        });

        this.entityModel.entityId = this.productId;
        this.entityModel.entityType = 102;
        this.initTabs();
    }

    /**
     * initialize tab
     * */
    initTabs(): void {
        this.productService.getPageDetails(this.productId).subscribe(data => {
            this.tabs = data.result.tabItems
        });
    }

    /**
     * Event
     * */
    ngAfterViewInit(): void {

        //if it is new mode then hide other tab except primary component
        if (this.productId != null && this.productId != undefined) {
            this.tabPageServiceStyle = "tab-item-visible";
        }
    }
}

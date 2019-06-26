import { Component, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule, DxTabsModule, DxTabPanelModule, DxTemplateModule, DxListModule, DxTabPanelComponent } from 'devextreme-angular';
import { TypeAndCategoryService } from './../../../system-settings/services/type-and-category.service';
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ToolbarType } from './../../../application-shared/components/titlebar/utilities';


@Component({
    selector: 'app-type-and-category-menu',
    templateUrl: './type-and-category-menu.component.html',
    styleUrls: ['./type-and-category-menu.component.scss']
})

export class TypeAndCategoryComponent implements AfterViewInit {
    
    menuDataSource: any=[];

    tabContentHeight: number = 500;

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;


    @ViewChild('#tabPanelTypeNCategory')
    tabPanelTypeNCategory: DxTabPanelComponent;

    /*
     * @HostListener
     **/
    @HostListener('window:resize') onResize() {
        this.tabContentHeight = window.innerHeight - 110;
    }

    constructor(private typeAndCategoryService: TypeAndCategoryService, private router: Router) {    
        this.initialMenuDataSource();
    }
   
    /**
     * ngAfterViewInit event
     */
    ngAfterViewInit() {
        this.titlebar.initializeToolbar("Types & Categories", null, ToolbarType.LinkPage);
    }

    /**
     * ngOnInit event
     */
    ngOnInit() {

        this.tabContentHeight = window.innerHeight - 110;
    }

    /**
     * initial type and category tab data source
     */
    initialMenuDataSource() {        
        this.typeAndCategoryService.getCustomCategoryTypes().subscribe(response => {            
            this.menuDataSource = response.result.customCategoryModules;
        });
    }
   
    /**
   * on close button clicked
   */
    onCloseClicked(): void {
        this.router.navigate(['/']);
    }
}

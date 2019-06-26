import { Component, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule, DxTabsModule, DxTabPanelModule, DxTemplateModule, DxListModule, DxTabPanelComponent, DxMultiViewComponent, DxMultiViewModule } from 'devextreme-angular';
import { SystemConfigurationService } from './../../../system-settings/services/system-configuration.service';
import { TitlebarComponent } from './../../../application-shared/components/titlebar/titlebar.component';
import { ToolbarType } from './../../../application-shared/components/titlebar/utilities';

@Component({
    selector: 'app-configurations',
    templateUrl: './configuration-menu.component.html',
    styleUrls: ['./configuration-menu.component.scss']
})
export class ConfigurationComponent {

    menuDataSource: any = [];
    tabContentHeight: number = 500;

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;


    @ViewChild('#multiViewConfiguration')
    multiViewConfiguration: DxMultiViewComponent;

    /*
     * @HostListener
     **/
    @HostListener('window:resize') onResize() {
        this.tabContentHeight = window.innerHeight - 110;
    }

    constructor(private configurationService: SystemConfigurationService, private router: Router) {
        this.initialMenuDataSource();
    }

    /**
     * ngAfterViewInit event
     */
    ngAfterViewInit() {
        this.titlebar.initializeToolbar("Configurations", null, ToolbarType.LinkPage);
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
        this.configurationService.getConfigurationMenu().subscribe(response => {
            
            this.menuDataSource = response.result
        });
    }

    /**
   * on close button clicked
   */
    onCloseClicked(): void {
        this.router.navigate(['/']);
    }

}

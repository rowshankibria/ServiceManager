import { Component, OnInit, Output, EventEmitter, Input, forwardRef, AfterViewInit, HostListener } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule } from 'devextreme-angular';
import { ListComponent } from './../../../../application-shared/components/list/list.component';

@Component({
    selector: 'app-system-configuration',
    templateUrl: './system-configuration.component.html',
    styleUrls: ['./system-configuration.component.scss']
})
/** system-configuration component*/
export class SystemConfigurationComponent {
    tabs: any = [{ id: 1, title: "Security Configuration", template: "securityConfiguration" }
        , { id: 2, title: "Security Profiles", template: "securityProfiles" }
        , { id: 3, title: "Email Servers", template: "emailServers" }
        /*, { id: 4, title: "Document Extensions", template: "documentExtensions" }*/];

    securityProfilePageKey: string = "system-configuration-security-profiles";
    emailServerPageKey: string = "system-configuration-email-servers";

    constructor() {

    }


    /**
     * @HostListener resize event
     */
    @HostListener('window:resize') onResize() {
        this.setToolbarSize();
    }

    /**
     * set toolbar width dynamically
     */
    setToolbarSize(): void {

        var dom = document.getElementById('div-outer-tab')
        let windowInrWidth = window.innerWidth;
        let toolbarWidth = windowInrWidth;
        //if window width 
        if (windowInrWidth > 992) {
            dom.style.left = '200px';
        }
        else {
            dom.style.left = '0px';
        }
    }

}

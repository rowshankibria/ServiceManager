import { Component, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';
import { confirm, alert } from 'devextreme/ui/dialog';
import { TitlebarComponent } from './../../../../../application-shared/components/titlebar/titlebar.component';
import { ToolbarItem, ToolbarItemOption } from './../../../../../application-shared/components/titlebar/toolbar-item';
import { ToolbarType } from './../../../../../application-shared/components/titlebar/utilities';
import { Observable } from 'rxjs';
import { debug } from 'util';
import { MessageService } from '../../../../../../shared/services/message.service';
import { debounce } from 'rxjs/operator/debounce';
import { SecurityProfileService } from './../../../../services/security-profile.service';

@Component({
    selector: 'app-security-profiles-form',
    templateUrl: './security-profiles-form.component.html',
    styleUrls: ['./security-profiles-form.component.scss']
})
/** security-policy-form component*/
export class SecurityProfilesFormComponent implements AfterViewInit {
    /** security-policy-form ctor */

    securityProfileId: number = 0;
    isNew: boolean = true;
    aLenght: number = 0;

    tabs: any = [{ id: 1, title: "Security Policy", template: "securityPolicy" }
        , { id: 2, title: "Password Settings", template: "passwordSetting" }
        , { id: 3, title: "Session & Access Control", template: "sessionAccessControl" }];

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    constructor(private securityProfileService: SecurityProfileService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {
             
    }

    /**
 * ngOnInit event
 */
    ngOnInit() {

        this.route.params.subscribe(params => {
            if (params['id'] != null && params['id'] != undefined) {
                this.securityProfileId = params['id'];
            }
        });
    }

    ngAfterViewInit(): void {
        if (this.securityProfileId > 0) {
            this.isNew = false;
        }
        if (this.isNew) {            
            this.aLenght = this.tabs.length;
            for (var i = 1; i < this.aLenght; i++) {
                this.tabs.pop(i);
            }
        }
    }
}

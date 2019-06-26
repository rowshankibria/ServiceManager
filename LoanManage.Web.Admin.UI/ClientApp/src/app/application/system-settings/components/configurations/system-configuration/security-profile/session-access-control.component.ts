import { Component, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule, DxButtonModule, DxValidationGroupComponent } from 'devextreme-angular';
import { confirm, alert } from 'devextreme/ui/dialog';
import { TitlebarComponent } from './../../../../../application-shared/components/titlebar/titlebar.component';
import { ToolbarItem, ToolbarItemOption } from './../../../../../application-shared/components/titlebar/toolbar-item';
import { ToolbarType, DetailPageAction } from './../../../../../application-shared/components/titlebar/utilities';
import { Observable } from 'rxjs';
import { debug } from 'util';
import { MessageService } from '../../../../../../shared/services/message.service';
import { NavigationService } from '../../../../../../shared/services/navigation.service';
import { debounce } from 'rxjs/operator/debounce';
import { SecurityProfileService } from './../../../../services/security-profile.service';

@Component({
    selector: 'app-session-access-control',
    templateUrl: './session-access-control.component.html',
    styleUrls: ['./session-access-control.component.scss']
})
/** security-policy-form component*/
export class SessionAccessControlComponent implements AfterViewInit {
    /** security-policy-form ctor */

    securityProfile: any = {};
    securityProfileId: number = 0;
    entityName: string = "";
    contentClass: any = "detail-page-content-div";

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    constructor(private securityProfileService: SecurityProfileService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private navigationService: NavigationService
    ) {

    }

    /**
 * ngOnInit event
 */
    ngOnInit() {

        this.route.params.subscribe(params => {
            if (params['id'] != undefined) {
                this.securityProfileId = params['id'];
            }
        });
        this.init();
    }

    init(): void {
        this.securityProfileService.getById(this.securityProfileId).subscribe(data => {

            this.securityProfile = data.result.securityProfile,
                this.titlebar.initializeToolbar(data.result.securityProfile.profileName == undefined ? "New Security Policy" : data.result.securityProfile.profileName, null, ToolbarType.DetailTabPage),
                this.contentClass = "detail-page-content-div-tab";
        });
    }

    ngAfterViewInit(): void {
    }

    /**
 * validate and save data
 */
    validateAndSave(action: DetailPageAction): void {
        this.saveEntity(action);
    }

    saveEntity(action: DetailPageAction): void {
        
            this.securityProfileService.updateEntity(this.securityProfileId, this.securityProfile).subscribe(data => {
                this.messageService.success("Record has been save successfully", 'Information');
                this.redirectToListPage(action);
            });        
    }

    /**
     * on save button clicked
     */
    onSaveClicked(e): void {
        this.validateAndSave(DetailPageAction.Save);
    }

    /**
     * on save and new button clicked
     */
    onSaveNNewClicked(): void {

        this.validateAndSave(DetailPageAction.SaveAndNew);
    }

    /**
     * on save and close button clicked
     */
    onSaveNCloseClicked(): void {

        this.validateAndSave(DetailPageAction.SaveAndClose);
    }

    /**
    * redirect to link page
    */
    redirectToListPage(action: DetailPageAction): void {

        //if (closedWindow) {
        //    this.router.navigate(['/system-settings/configurations-menu']);
        //}

        var newNavigationUrl = '/system-settings/security-profiles-form';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.securityProfileId, this.router.url);
        }

    }

    /**
     * on close button clicked
     */
    onCloseClicked(): void {
        this.redirectToListPage(DetailPageAction.Close);
    }
}

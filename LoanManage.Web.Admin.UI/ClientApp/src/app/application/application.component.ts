import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from './application-shared/components/sidebar/sidebar.component';
import { ApplicationMenuService } from './application-shared/services/application-menu.service';

@Component({
    selector: 'app-application',
    templateUrl: './application.component.html',
    styleUrls: ['./application.component.scss']
})
/** application component*/
export class ApplicationComponent {

    applicationMenu: any;
    applicationHeader: any;
    isSystemAdmin: boolean = false;
  /** application ctor */
    constructor(private applicationMenuService: ApplicationMenuService,) {

    }
    ngOnInit() {
        //default select CRM menu        
        this.getUserMenu();        
    }


    getUserMenu(): void {

        this.applicationMenuService.getCurrentUserAppMenu()
            .subscribe(data => {
                this.applicationMenu = data.result.applicationMenu;
                this.applicationHeader = data.result.applicationHeader;
                this.isSystemAdmin = data.result.isSystemAdmin;
            });
    }

}

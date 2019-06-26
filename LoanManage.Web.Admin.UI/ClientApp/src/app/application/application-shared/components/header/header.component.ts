import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './../../../../shared/services/authentication.service';



@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass: string = 'push-right';
    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean = true;
    userName: string;
    imageUrl: string = "../../../../../assets/img/no-image.png";

    //@Input('ApplicationHeader') applicationHeader: any;
    applicationHeader: any;
    @Input()
    set ApplicationHeader(header: any) {
        this.applicationHeader = header;
        if (header != undefined && header.displayName != undefined) {
            this.userName = header.displayName;

        }
    }

    isSystemAdmin: boolean = false;
    @Input()
    set IsSystemAdmin(isAdmin: any) {
        this.isSystemAdmin = isAdmin;
    }

    constructor(private translate: TranslateService, public router: Router
       , public authService: AuthenticationService
    ) {

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        if (this.authService.isAuthorized()) {
            this.isAuthorized = true;
        }
        else {
            this.isAuthorized = false;
        }

    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    login() {
        //this.authService.login();
    }


    logout() {
        this.authService.logout();
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}

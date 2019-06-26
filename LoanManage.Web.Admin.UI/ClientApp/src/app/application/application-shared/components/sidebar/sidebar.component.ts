import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ApplicationMenuService } from './../../services/application-menu.service';
declare var $: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    imageUrl: string = "../../../../../assets/img/no-image.png";
    isActive: boolean = false;
    selectedMenu: string = 'loan-header';
    defaultMenu: string = 'loan-header';
    pushRightClass: string = 'push-right';
    @Input('ApplicationMenu') applicationMenu: any;

    userName: string;
    applicationHeader: any;
    @Input()
    set ApplicationHeader(header: any) {
        this.applicationHeader = header;
        if (header != undefined && header.displayName != undefined) {
            this.userName = header.displayName;


            if (header.photoThumbnail != null && header.photoThumbnail != "") {

                this.imageUrl = "data:image/jpg;base64," + header.photoThumbnail;
            }
        }
    }

    constructor(private applicationMenuService: ApplicationMenuService, public router: Router) {

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
     
    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(elementName: any) {
        $('.list-group-item').removeClass('menu-selected');
        $('#' + elementName).addClass('menu-selected');
        this.selectedMenu = elementName;
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {

    }
}

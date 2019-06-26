import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Injectable()
export class NavigationService {



    constructor(private router: Router) {


    }

    navigateAndSetReturnUrl(url: string, returnUrl: string) {

        var key = url.replace(/\//g, '').replace(/-/g, '');
        sessionStorage.setItem(key, returnUrl);
        this.router.navigate([url]);
    }

    navigateAndUpdateReturnUrl(url: string, currentUrl: string) {
        var key = currentUrl.replace(/\//g, '').replace(/-/g, '');
        var returnUrl = sessionStorage.getItem(key);

        key = url.replace(/\//g, '').replace(/-/g, '');
        sessionStorage.setItem(key, returnUrl);
        this.router.navigate([url]);
    }

    navigateToReturnurl(currentUrl: string) {

        var key = currentUrl.replace(/\//g, '').replace(/-/g, '');

        var returnUrl = sessionStorage.getItem(key);
        if (returnUrl == null || returnUrl == undefined) {
            returnUrl = '/';
        }
        sessionStorage.removeItem(key);
        this.router.navigate([returnUrl]);
    }



    navigate(url: string) {
        this.router.navigate([url]);
    }

    navigateToNewTab(url: string) {

        window.open(url, '_blank');
    }


}


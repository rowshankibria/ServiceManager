
import {mergeMap, map, filter} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Spinkit } from 'ng-http-loader/spinkits';





import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { OidcSecurityService, AuthorizationResult } from 'angular-auth-oidc-client';

import { Subscription } from 'rxjs';
import { alert } from 'devextreme/ui/dialog';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy
{

    public spinkit = Spinkit;

    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean;

    onChecksessionChanged: Subscription;
    checksession = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        public oidcSecurityService: OidcSecurityService
    )
    {
        if (this.oidcSecurityService.moduleSetup) {
            this.doCallbackLogicIfRequired();
        } else {
            this.oidcSecurityService.onModuleSetup.subscribe(() =>
            {
                this.doCallbackLogicIfRequired();
            });
        }

        this.oidcSecurityService.onCheckSessionChanged.subscribe(
            (checksession: boolean) =>
            {
                this.checksession = checksession;
            });

        this.oidcSecurityService.onAuthorizationResult.subscribe(
            (authorizationResult: AuthorizationResult) =>
            {
                this.onAuthorizationResultComplete(authorizationResult);
            });
    }

    ngOnDestroy(): void
    {
        this.isAuthorizedSubscription.unsubscribe();
        this.oidcSecurityService.onModuleSetup.unsubscribe();
        this.oidcSecurityService.onCheckSessionChanged.unsubscribe();
        this.oidcSecurityService.onAuthorizationResult.unsubscribe();
    }

    ngOnInit(): void
    {
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map((route) =>
            {
                while (route.firstChild) route = route.firstChild;
                return route;
            }),
            filter((route) => route.outlet === 'primary'),
            mergeMap((route) => route.data),)
            .subscribe((event) => this.titleService.setTitle(event['title']));
    }

    private doCallbackLogicIfRequired()
    {
        if (window.location.hash) {
            this.oidcSecurityService.authorizedCallback();
        }
    }

    private onAuthorizationResultComplete(authorizationResult: AuthorizationResult)
    {
        if (authorizationResult === AuthorizationResult.unauthorized) {
            if (window.parent) {
                // sent from the child iframe, for example the silent renew
                window.parent.location.href = '/login';
            } else {
                // sent from the main window
                window.location.href = '/login';
            }
        }
    }
}

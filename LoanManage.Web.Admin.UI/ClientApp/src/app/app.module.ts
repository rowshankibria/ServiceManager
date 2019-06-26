import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler, ApplicationRef } from '@angular/core';
import { Configuration } from './app.constants';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiHttpService } from './shared/services/api-http.service'
import { MessageService } from './shared/services/message.service'
import { NavigationService } from './shared/services/navigation.service'
import { DxDataGridModule, DxValidationGroupModule } from 'devextreme-angular';
import { Http, HttpModule, URLSearchParams } from '@angular/http';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap';
import { AuthModule, OidcSecurityService, OpenIDImplicitFlowConfiguration, OidcConfigService, AuthWellKnownEndpoints } from 'angular-auth-oidc-client';
//import { AuthService } from './shared/services/auth.service';
import { JwtInterceptor } from './shared/services/jwt-interceptor';
import { AuthenticationGuard } from './shared/services/authentication-guard';
import { AuthenticationService } from './shared/services/authentication.service';

import { LoginModule } from './login/login.module';
import { ShowYesNoDirective } from './shared/directives/show-yes-no.directive'
import { GlobalErrorHandlerService } from './shared/services/global-error-handler.service';
import { ClipboardModule } from 'ngx-clipboard';
import { environment } from '../environments/environment';
import { NpDatepickerModule } from 'angular-nepali-datepicker';



// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent
        , ShowYesNoDirective
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        AppRoutingModule,
        HttpClientModule,
        DxDataGridModule,
        HttpModule,
        CommonModule,
        NgHttpLoaderModule,
        ReactiveFormsModule,
        FormsModule,
        ToastrModule.forRoot({
            closeButton: true,
            positionClass: 'toast-top-center',
            easing: 'ease-in',
            easeTime: 500,
            enableHtml: true,
            timeOut: 1500,
            extendedTimeOut: 1000
        }),
        BrowserAnimationsModule,
        AccordionModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AuthModule.forRoot()
        , DxValidationGroupModule
        , ClipboardModule
        , NpDatepickerModule
    ],
    providers: [ApiHttpService
        , MessageService
        , NavigationService
        , AuthenticationGuard
        , AuthenticationService
        //, AuthService
        , {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
        , Configuration
    ],
    exports: [
        ShowYesNoDirective
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }

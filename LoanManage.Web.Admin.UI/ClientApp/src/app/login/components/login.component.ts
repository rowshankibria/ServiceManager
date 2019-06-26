import { Component, OnInit, AfterViewInit, HostBinding, Output, Input, ViewChild } from '@angular/core';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/first';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MessageService } from './../../shared/services/message.service';
//import { MessageService } from './../../../../shared/services/message.service'
declare var $: any;
declare var revapi1014: any;
declare var tpj: any;


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

/** login component*/
export class LoginComponent implements AfterViewInit {

    public model: any = { email: '', password: '' };
    returnUrl: string;
    error = '';

    @HostBinding('class') classes: string = 'm-login__signin';
    @Output() actionChange = new Subject<string>();
    public loading = false;

    @Input() action: string;

    @ViewChild('f') f: NgForm;
    errors: any = [];

    ngAfterViewInit() {
        //Copy in all the js code from the script.js. Typescript will complain but it works just fine

        //// initialization of carousel
        //$.HSCore.components.HSCarousel.init('.js-carousel');
        //// initialization of header
        //$.HSCore.components.HSHeader.init($('#js-header'));

    }


    /** login ctor */
    constructor(public authService: AuthenticationService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router,
        //public authService: AuthService
    ) {

    }

    submit() {

        if (this.model.email == "" && this.model.password == "") {
            this.messageService.error("Please input email/user name and password to login", '');
        }
        else {

            this.authService.login(this.model.email, this.model.password)
                .first()
                .subscribe(
                    data => {
                        this.router.navigate(['/']);
                    },
                    error => {
                        //this.error = error;
                        //this.loading = false;
                        this.messageService.error("Please verify email/user name and password to login", '');
                    });
            //this.spinner.active = true;
            //if (this.validate(this.f)) {
            //    this.authService.login(this.model).subscribe(response => {
            //        if (typeof response !== 'undefined') {
            //            this.router.navigate(['/']);
            //        } else {
            //            //this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'error');
            //        }
            //        this.spinner.active = false;
            //        this.cdr.detectChanges();
            //    });
            //}
        }
    }

    login() {
        // this.authService.login();
        this.authService.login("admin", "admin")
            .first()
            .subscribe(
                data => {
                    this.router.navigate(['/']);
                },
                error => {
                    //this.error = error;
                    //this.loading = false;
                });
    }
}

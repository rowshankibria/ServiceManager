import {
	Component,
	OnInit,
	Input,
	Output,
	ViewChild,
	ElementRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../../../core/auth/authentication.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as objectPath from 'object-path';
import { AuthNoticeService } from '../../../../core/auth/auth-notice.service';
import { SpinnerButtonOptions } from '../../../partials/content/general/spinner-button/button-options.interface';
import { TranslateService } from '@ngx-translate/core';
//import { ReCaptchaV3Service } from 'ngx-captcha';
import { UserRegisration } from '../../../../core/models/user-management/user-registration';

@Component({
	selector: 'm-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	public model: UserRegisration;
	@Input() action: string;
	@Output() actionChange = new Subject<string>();
	public loading = false;

	@ViewChild('f') f: NgForm;
	errors: any = [];
	protected aFormGroup: FormGroup;

	spinner: SpinnerButtonOptions = {
		active: false,
		spinnerSize: 18,
		raised: true,
		buttonColor: 'primary',
		spinnerColor: 'accent',
		fullWidth: false
	};

	constructor(
		private authService: AuthenticationService,
		public authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		//private reCaptchaV3Service: ReCaptchaV3Service,
		private formBuilder: FormBuilder
	) {
		this.model = new UserRegisration();
	}

	ngOnInit() {
		// this.aFormGroup = this.formBuilder.group({
		// 	recaptcha: ['', Validators.required]
		//   });
	}

	//Site key
	//Use this in the HTML code your site serves to users.
	//6LcNYXsUAAAAAN_C9OVU7pW7CkZJnBEn1eyRSkai

	//Secret key
	//Use this for communication between your site and Google. Be sure to keep it a secret.
	//6LcNYXsUAAAAAKhnZLkF8vua9ur2eTX2Xpvt3GTo
	siteKey: string = "6LcNYXsUAAAAAN_C9OVU7pW7CkZJnBEn1eyRSkai";
	handleSuccess(event: any){
		// this.reCaptchaV3Service.execute(this.siteKey, 'login', (token) => {
		// 	console.log('This is your token: ', token);
		//   });
	}	

	loginPage(event: Event) {
		event.preventDefault();
		this.action = 'login';
		this.actionChange.next(this.action);
	}

	submit() {
		this.spinner.active = true;
		if (this.validate(this.f)) {
			this.authService.register(this.model).subscribe(response => {
				this.action = 'login';
				this.actionChange.next(this.action);
				this.spinner.active = false;
				this.authNoticeService.setNotice(this.translate.instant('AUTH.REGISTER.SUCCESS'), 'success');
			});
		}
	}

	validate(f: NgForm) {
		if (f.form.status === 'VALID') {
			return true;
		}

		this.errors = [];
		if (objectPath.get(f, 'form.controls.fullname.errors.required')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.REQUIRED', {name: this.translate.instant('AUTH.INPUT.FULLNAME')}));
		}

		if (objectPath.get(f, 'form.controls.email.errors.email')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.INVALID', {name: this.translate.instant('AUTH.INPUT.EMAIL')}));
		}
		if (objectPath.get(f, 'form.controls.email.errors.required')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.REQUIRED', {name: this.translate.instant('AUTH.INPUT.EMAIL')}));
		}

		if (objectPath.get(f, 'form.controls.password.errors.required')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.REQUIRED', {name: this.translate.instant('AUTH.INPUT.PASSWORD')}));
		}
		if (objectPath.get(f, 'form.controls.password.errors.minlength')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.MIN_LENGTH', {name: this.translate.instant('AUTH.INPUT.PASSWORD'), min: 4}));
		}

		if (objectPath.get(f, 'form.controls.rpassword.errors.required')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.REQUIRED', {name: this.translate.instant('AUTH.INPUT.CONFIRM_PASSWORD')}));
		}

		if (objectPath.get(f, 'form.controls.agree.errors.required')) {
			this.errors.push(this.translate.instant('AUTH.VALIDATION.AGREEMENT_REQUIRED'));
		}

		if (this.errors.length > 0) {
			this.authNoticeService.setNotice(this.errors.join('<br/>'), 'error');
			this.spinner.active = false;
		}

		return false;
	}

	handleExpire() {

	}

	handleLoad() {

	}
}

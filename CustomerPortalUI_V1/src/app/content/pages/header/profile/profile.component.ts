import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SystemUser } from '../../../../core/models/systemuser';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../core/auth/authentication.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionStorage } from '../../../../core/auth/session-storage.service';

@Component({
  selector: 'm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.style.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  SystemUser: any;
  
  constructor(private router: Router,
		private authService: AuthenticationService,
    private sanitizer: DomSanitizer,
    private sessionStorage: SessionStorage) { }

  ngOnInit() {
    this.SystemUser = this.sessionStorage.getSystemUser();
		if(this.SystemUser.contact == null || this.SystemUser.contact == undefined) {
			this.authService.logout(true);
		}
  }
}

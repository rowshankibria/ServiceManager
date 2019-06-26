import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SystemUser } from '../models/systemuser';

@Injectable()
export class SessionStorage {
	/**
	 * Get SystemUser
	 * @returns {SystemUser}
	 */
	public getSystemUser(): SystemUser {
		return JSON.parse(localStorage.getItem('usr')) as SystemUser;
	}

	/**
	 * Set SystemUser
	 */
	public updateSystemUser(systemUser: SystemUser) {
		localStorage.setItem('usr', null);
		localStorage.setItem('usr', JSON.stringify(systemUser));
    }

	/**
	 * Set SystemUser
	 */
	public setSystemUser(systemUser: SystemUser) {
		localStorage.setItem('usr', JSON.stringify(systemUser));
    }
}
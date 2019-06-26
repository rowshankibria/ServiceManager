import { ConfigModel } from '../core/interfaces/config';

export class PagesConfig implements ConfigModel {
	public config: any = {};

	constructor() {
		this.config = {
			'/': {
				page: {
					title: 'Home',
					desc: 'Latest updates and statistic charts'
				}
			},
			application: {
				page: { title: 'Customers', desc: '' },
				applications: {					
					edit: {
						page: { title: 'Application Detail', desc: '' }
					},
					add: {
						page: { title: 'Application Detail', desc: '' }
					}
				}
			},
			profile: {
				page: { title: 'User Profile', desc: '' }
			},
			404: {
				page: { title: '404 Not Found', desc: '', subheader: false }
			}
		};
	}
}

// tslint:disable-next-line:no-shadowed-variable
import {ConfigModel} from '../core/interfaces/config';

// tslint:disable-next-line:no-shadowed-variable
export class MenuConfig implements ConfigModel {
	public config: any = {};

	constructor() {
		this.config = {
			header: {
				self: {},
				items: [
					{
						title: 'Home',
						root: true,
						page: '/',
					},
					{
						title: 'My Applications',
						root: true,
						page: '/application',
					},
					{
						title: 'My Profile',
						root: true,
						page: '/profile',
					}
				]
			},
			aside: {
				self: {},
				items: [
					{
						section: "Departments"
					},
					{
						title: "Resources",
						desc: "",
						icon: "flaticon-layers",
						bullet: "dot",
						root: true,
						submenu: [
							{
								title: "Layout Builder",
								page: "/builder",
							},
							{
								title: "Timesheet",
								tooltip: 'Non functional dummy link',
							},
							{
								title: "Payroll",
								tooltip: 'Non functional dummy link',
							},
							{
								title: "Contacts",
								tooltip: 'Non functional dummy link',
							}
						]
					},
					{
						title: "Finance",
						root: true,
						icon: "flaticon-suitcase",
					},
					{
						title: "Support",
						root: true,
						icon: "flaticon-graphic-1",
						submenu: [
							{
								title: "Reports",
								tooltip: 'Non functional dummy link',
							},
							{
								title: "Cases",
								submenu: [
									{
										title: "Pending",
										tooltip: 'Non functional dummy link',
									},
									{
										title: "Urgent",
										tooltip: 'Non functional dummy link',
									},
									{
										title: "Done",
										tooltip: 'Non functional dummy link',
									},
									{
										title: "Archive",
										tooltip: 'Non functional dummy link',
									}
								]
							},
							{
								title: "Clients",
								tooltip: 'Non functional dummy link',
							},
							{
								title: "Audit",
								tooltip: 'Non functional dummy link',
							}
						]
					},
					{
						title: "Administration",
						root: true,
						icon: "flaticon-light",
						tooltip: 'Non functional dummy link',
					},
					{
						title: "Management",
						root: true,
						icon: "flaticon-share",
						tooltip: 'Non functional dummy link',
					},
					{section: "Reports"},
					{
						title: "Accounting",
						root: true,
						icon: "flaticon-graphic",
						tooltip: 'Non functional dummy link',
					},
					{
						title: "Applications",
						root: true,
						icon: "flaticon-network",
						tooltip: 'Non functional dummy link',
					},
					{
						title: "Sales",
						root: true,
						icon: "flaticon-network",
						tooltip: 'Non functional dummy link',
					},
					{
						title: "IPO",
						root: true,
						icon: "flaticon-technology",
						tooltip: 'Non functional dummy link',
					}
				],

			}
		}
	}
}

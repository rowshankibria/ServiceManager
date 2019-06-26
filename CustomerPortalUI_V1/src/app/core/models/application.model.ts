import { BaseModel } from './_base.model';

export class ApplicationModel extends BaseModel {
	id: number;
	model: string;
	manufacture: string;
	modelYear: number;
	mileage: number;
	description: string;
	color: string;
	price: number;
	condition: number;
	status: number;
	VINCode: string;

	clear() {
		this.model = '';
		this.manufacture = '';
		this.modelYear = 2000;
		this.mileage = 0;
		this.description = '';
		this.color = 'Black';
		this.price = 1000;
		this.condition = 0;
		this.status = 0;
		this.VINCode = '';
	}
}

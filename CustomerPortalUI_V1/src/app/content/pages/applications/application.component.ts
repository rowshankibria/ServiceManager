import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'm-application',
	templateUrl: './application.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
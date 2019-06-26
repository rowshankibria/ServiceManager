import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpUtilsService } from './http-utils.service';
import { ApplicationModel } from '../models/application.model';
import { QueryParamsModel } from '../models/query-params.model';
import { QueryResultsModel } from '../models/query-results.model';

const API_URL = 'http://loanapi.pyxidaapps.com';
const API_PRODUCTS_URL = '/api/loan/loanApplication';
// Real REST API
@Injectable()
export class ApplicationService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new application to the server
	createApplication(application): Observable<ApplicationModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<ApplicationModel>(API_PRODUCTS_URL, application, { headers: httpHeaders });
	}

	// READ
	getAllAppliations(): Observable<ApplicationModel[]> {
		let contactId: number = 1;
		return this.http.get<ApplicationModel[]>(API_URL + API_PRODUCTS_URL + '/get-application-list-by-contact' + `/${contactId}`);
	}

	getApplicationById(applicationId: number): Observable<ApplicationModel> {
		return this.http.get<ApplicationModel>(API_PRODUCTS_URL + `/${applicationId}`);
	}

	findApplications(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		return this.getAllAppliations().pipe(
			mergeMap(res => {
				const result = this.httpUtils.baseFilter(res, queryParams);
				return of(result);
			})
		);
	}

	// UPDATE => PUT: update the application on the server
	updateApplication(application: ApplicationModel): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.put(API_PRODUCTS_URL, application, { headers: httpHeaders });
	}

	// UPDATE Status
	// Comment this when you start work with real server
	// This code imitates server calls
	updateStatusForApplication(applications: ApplicationModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < applications.length; i++) {
			const _application = applications[i];
			_application.status = status;
			tasks$.push(this.updateApplication(_application));
		}
		return forkJoin(tasks$);
	}

	// DELETE => delete the application from the server
	deleteApplication(applicationId: number): Observable<ApplicationModel> {
		const url = `${API_PRODUCTS_URL}/${applicationId}`;
		return this.http.delete<ApplicationModel>(url);
	}

	deleteApplications(ids: number[] = []): Observable<any> {
		const tasks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			tasks$.push(this.deleteApplication(ids[i]));
		}
		return forkJoin(tasks$);
	}
}

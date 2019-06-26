import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ApplicationService } from '../../services/index';
import { QueryParamsModel } from '../query-params.model';
import { BaseDataSource } from './_base.datasource';
import { QueryResultsModel } from '../query-results.model';

export class ApplicationsDataSource extends BaseDataSource {
	constructor(private applicationService: ApplicationService) {
		super();
	}

	loadApplications(queryParams: QueryParamsModel) {
		this.applicationService.lastFilter$.next(queryParams);
        this.loadingSubject.next(true);

		this.applicationService.findApplications(queryParams)
			.pipe(
				tap(res => {
					this.entitySubject.next(res.items);
					this.paginatorTotalSubject.next(res.totalCount);
				}),
				catchError(err => of(new QueryResultsModel([], err))),
				finalize(() => this.loadingSubject.next(false))
			).subscribe();
	}
}

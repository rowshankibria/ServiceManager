import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import DataSource from 'devextreme/data/data_source';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ResponseContentType, RequestOptions } from '@angular/http';
import { Options } from 'selenium-webdriver';

@Injectable()
export class ApiHttpService
{
    private apiUrl: string = '';
    private rootUrl: string = '';

    constructor(private http: HttpClient)
    {
        this.apiUrl = environment.apiUrl;
        this.rootUrl = environment.rootUrl;
    }

    GETDXGrid(url: string, loadOptions: any): Observable<any>
    {        
        let params: HttpParams = new HttpParams()
            .set("requireTotalCount", loadOptions.requireTotalCount ? loadOptions.requireTotalCount : "")
            .set("primaryKey", loadOptions.primaryKey ? loadOptions.primaryKey : "")
            .set("remoteGrouping", loadOptions.remoteGrouping ? loadOptions.remoteGrouping : "")
            .set("remoteSelect", loadOptions.remoteSelect ? loadOptions.remoteSelect : "")
            .set("preSelect", loadOptions.preSelect ? loadOptions.preSelect : "")
            .set("select", loadOptions.select ? loadOptions.select : "")
            .set("groupSummary", loadOptions.groupSummary ? JSON.stringify(loadOptions.groupSummary) : "")
            .set("defaultSort", loadOptions.defaultSort ? JSON.stringify(loadOptions.defaultSort) : "")
            .set("totalSummary", loadOptions.totalSummary ? JSON.stringify(loadOptions.totalSummary) : "")
            .set("group", loadOptions.group ? JSON.stringify(loadOptions.group) : "")
            .set("sort", loadOptions.sort ? JSON.stringify(loadOptions.sort) : "")
            .set("take", loadOptions.take)
            .set("skip", loadOptions.skip)
            .set("isCountQuery", loadOptions.isCountQuery ? JSON.stringify(loadOptions.isCountQuery) : "")
            .set("requireGroupCount", loadOptions.requireGroupCount ? JSON.stringify(loadOptions.requireGroupCount) : "")
            .set("filter", loadOptions.filter ? JSON.stringify(loadOptions.filter) : "")

        //return this.http.get(this.apiUrl + url, { params: params }).toPromise().catch();
        return this.http.get(this.apiUrl + url, { params: params , responseType: 'json' });
    }

    GETGridData(url: string, loadOptions: any): Observable<any> {
               

        let params: HttpParams = new HttpParams()
            .set("requireTotalCount", loadOptions.requireTotalCount ? loadOptions.requireTotalCount : "")
            .set("primaryKey", loadOptions.primaryKey ? "" : "")
            .set("remoteGrouping", loadOptions.remoteGrouping ? loadOptions.remoteGrouping : "")
            .set("remoteSelect", loadOptions.remoteSelect ? loadOptions.remoteSelect : "")
            .set("preSelect", loadOptions.preSelect ? loadOptions.preSelect : "")
            .set("select", loadOptions.select ? loadOptions.select : "")
            .set("groupSummary", loadOptions.groupSummary ? JSON.stringify(loadOptions.groupSummary) : "")
            .set("defaultSort", loadOptions.defaultSort ? JSON.stringify(loadOptions.defaultSort) : "")
            .set("totalSummary", loadOptions.totalSummary ? JSON.stringify(loadOptions.totalSummary) : "")
            .set("group", loadOptions.group ? JSON.stringify(loadOptions.group) : "")
            .set("sort", loadOptions.sort ? JSON.stringify(loadOptions.sort) : "")
            .set("take", loadOptions.take)
            .set("skip", loadOptions.skip)
            .set("isCountQuery", loadOptions.isCountQuery ? JSON.stringify(loadOptions.isCountQuery) : "")
            .set("requireGroupCount", loadOptions.requireGroupCount ? JSON.stringify(loadOptions.requireGroupCount) : "")
            .set("filter", loadOptions.filter ? JSON.stringify(loadOptions.filter) : "")
            //.set("filter", JSON.stringify(entityType))

        //params.append("entityType", JSON.stringify(entityType));

        //return this.http.get(this.apiUrl + url, { params: params }).toPromise().catch();
        return this.http.get(this.apiUrl + url, { params: params, responseType: 'json' });
    }

    GETTreeData(url: string, loadOptions: any): Observable<any> {



        //let params: HttpParams = new HttpParams()
        //    .set("sort", JSON.stringify(loadOptions.sort))
        //    .set("filter", JSON.stringify(loadOptions.filter))
        //    .set("group", JSON.stringify(loadOptions.group))
        //    .set("parentIds", JSON.stringify(loadOptions.parentIds))
        //    .set("requireTotalCount", loadOptions.requireTotalCount ? loadOptions.requireTotalCount : "")
        //    .set("primaryKey", loadOptions.primaryKey ? "" : "")
        //    .set("remoteGrouping", loadOptions.remoteGrouping ? loadOptions.remoteGrouping : "")
        //    .set("remoteSelect", loadOptions.remoteSelect ? loadOptions.remoteSelect : "")
        //    .set("preSelect", loadOptions.preSelect ? loadOptions.preSelect : "")
        //    .set("select", loadOptions.select ? loadOptions.select : "")
        //    .set("groupSummary", JSON.stringify(loadOptions.groupSummary))
        //    .set("defaultSort", JSON.stringify(loadOptions.defaultSort))
        //    .set("totalSummary", JSON.stringify(loadOptions.totalSummary))
        //    .set("take", loadOptions.take)
        //    .set("skip", loadOptions.skip)
        //    .set("isCountQuery", JSON.stringify(loadOptions.isCountQuery))
        //    .set("requireGroupCount", JSON.stringify(loadOptions.requireGroupCount))        
            

        let params: HttpParams = new HttpParams();
        [
            "sort",
            "filter",
            "group",
            "parentIds",
            "requireTotalCount",
            "primaryKey",
            "remoteGrouping",
            "remoteSelect",
            "preSelect",
            "select", 
            "groupSummary", 
            "defaultSort", 
            "totalSummary",
            "group", 
            "sort", 
            "take", 
            "skip", 
            "isCountQuery",
            "requireGroupCount",            
            "parentIds", 
        ].forEach(function (i) {
            if (i in loadOptions)
                params = params.set(i, JSON.stringify(loadOptions[i]));                
            });


        return this.http.get(this.apiUrl + url, { params: params, responseType: 'json' });
    }

    getApiUrl(url: string): string {
        return this.apiUrl + url;
    }

    getRootUrl(url: string): string {
        return this.rootUrl + url;
    }

    DownloadFile(url: string): Observable<any>
    {

        return this.http.get(this.apiUrl + url, { responseType: 'blob'});

    }

    GET(url: string): Observable<any>
    {         
        return this.http.get(this.apiUrl + url, { responseType: 'json' });
    }

    POST(url: string, data: any): Observable<any>
    {
        return this.http.post(this.apiUrl + url, data, { responseType: 'json' });
    }

    PUT(url: string, data: any): Observable<any>
    {        
        return this.http.put(this.apiUrl + url, data, { responseType: 'json' });
    }

    DELETE(url: string): Observable<any>
    {
        return this.http.delete(this.apiUrl + url, { responseType: 'json' });
    }
}

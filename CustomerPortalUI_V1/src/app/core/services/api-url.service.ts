import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
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

    getApiUrl(url: string): string {
        return this.apiUrl + url;
    }

    getRootUrl(url: string): string {
        return this.rootUrl + url;
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

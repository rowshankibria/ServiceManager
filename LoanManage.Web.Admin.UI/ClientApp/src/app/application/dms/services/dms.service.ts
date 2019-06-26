import { Injectable } from '@angular/core';
import { ApiHttpService } from './../../../shared/services/api-http.service'
import { Observable } from 'rxjs';
import saveAs from 'file-saver';
import { window } from 'rxjs/operators';
import { debug } from 'util';
import { ClipboardService } from 'ngx-clipboard';

@Injectable()
export class DmsService {


    url: string = '';

    constructor(private clipboardService: ClipboardService, private apiHttpService: ApiHttpService) {
    }

    getDocument(id: any) {

        this.url = 'dms/document/get-document/' + id;
        return this.apiHttpService.GET(this.url);
    }

    getDocumentsByEntity(entityTypeId: number, entityId: number) {
        this.url = 'dms/document/get-documents-by-entity/' + entityTypeId + '/' + entityId;
        return this.apiHttpService.GET(this.url);
    }

    saveDocumentsByEntity(entityTypeId: number, entityId: number, fileDataSource: any): any {
        this.url = 'dms/document/save-documents-by-entity/' + entityTypeId + '/' + entityId;
        return this.apiHttpService.PUT(this.url, fileDataSource );
    }

    saveDocuments(data: any) {

        this.url = 'dms/document/save-documents';
        return this.apiHttpService.POST(this.url, data);
    }

    updateDocument(id: number, data: any) {

        this.url = 'dms/document/update-document/' + id;
        return this.apiHttpService.PUT(this.url, data);
    }


    downloadLatestFile(id: any)
    {
        this.url = 'dms/document/get-download-file-name-by-id/' + id;

        return this.apiHttpService.GET(this.url).subscribe(res =>
        {
            this.url = 'dms/document/download-lastest-file/' + id;
            this.apiHttpService.DownloadFile(this.url).subscribe(data =>
            {
                var blob = new Blob([data], { type: data.type });
                saveAs(blob, res.result);
            })
        });
    }

    downloadProtectedFile(key: any)
    {
        this.url = 'dms/document/get-protected-file-name/' + key;

        return this.apiHttpService.GET(this.url).subscribe(res =>
        {
            this.url = 'dms/document/download-protected/' + key;
            this.apiHttpService.DownloadFile(this.url).subscribe(data =>
            {
                var blob = new Blob([data], { type: data.type });
                saveAs(blob, res.result);
            })
        });
    }

    downloadFile(id: any, fileName: any)
    {
        this.url = 'dms/document/download-file-by-id/' + id;
        this.apiHttpService.DownloadFile(this.url).subscribe(data =>
        {
            var blob = new Blob([data], { type: data.type });
            saveAs(blob, fileName);
        });
    }
     
    getDxGridRecords(url: any, params: any) {        
        return this.apiHttpService.GETDXGrid(url, params);
    }

    deleteRecord(url: any, id: any) {
        return this.apiHttpService.DELETE(url + id);
    }

    deleteRecords(url: any, ids: any[]) {
        return this.apiHttpService.POST(url, ids);
    }

  


}



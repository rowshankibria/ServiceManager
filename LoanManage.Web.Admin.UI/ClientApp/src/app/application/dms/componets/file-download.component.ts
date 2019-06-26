import { Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DmsService } from './../services/dms.service';
import { MessageService } from '../../../shared/services/message.service';

@Component({
    selector: 'app-file-download',
    templateUrl: './file-download.component.html',
    styleUrls: ['./file-download.component.scss']
})
/** file-download component*/
export class FileDownloadComponent {

    documentKey: any

    constructor(private dmsService: DmsService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router) {
        this.route.params.subscribe(params =>
        {
            if (params['documentKey'] != undefined) {
                this.documentKey = params['documentKey'];
            }
        });
    }


    ngOnInit(): void
    {
        this.dmsService.downloadProtectedFile(this.documentKey);
    }
}

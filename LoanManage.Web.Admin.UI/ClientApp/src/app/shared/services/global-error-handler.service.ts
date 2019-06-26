import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from './message.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler{


    constructor(private injector: Injector)
    {

    }

    handleError(error: any): void
    {
        const messageService = this.injector.get(MessageService);   
    }
}

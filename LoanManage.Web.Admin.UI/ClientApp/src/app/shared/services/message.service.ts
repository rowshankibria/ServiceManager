import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { confirm, alert } from 'devextreme/ui/dialog';

@Injectable()
export class MessageService {
    constructor(private toastrService: ToastrService) {

    }

    showDataSavedMsg(): void {
        this.toastrService.success(AppMessage.DataDelete, 'Information');
    }
    showDataUpdatedMsg(): void {
        this.toastrService.success(AppMessage.DataUpdated, 'Information');
    }

    showDataDeletedMsg(): void {
        this.toastrService.success(AppMessage.DataDelete, 'Information');
    }

    showInvalidSelectionMsg(): void {
        this.toastrService.warning(AppMessage.InvalidSelection, 'Invalid Selection');
    }

    showDeleteConfirmMsg(recordCount: any): any {
        var re = /~!Param1!~/gi;
        var msg = AppMessage.DeleteConfirm.toString().replace(re, recordCount);
        return confirm(msg, "Delete Confirmation");
    }

    showInvalidServiceUrlMsg(serviceName: any): void {
        var re = /~!Param1!~/gi;
        var msg = AppMessage.InvalidServiceUrl.toString().replace(re, serviceName);
        this.toastrService.warning(msg, 'Invalid Configuration');
    }

    showInvalidNavigationUrlMsg(navigationLink: any): void {
        var re = /~!Param1!~/gi;
        var msg = AppMessage.InvalidNavigationUrl.toString().replace(re, navigationLink);
        this.toastrService.warning(msg, 'Invalid Configuration');
    }

    success(message: string, header: string): void {
        this.toastrService.success(message, header, {
        });
    }

    error(message: string, header: string): void {
        this.toastrService.error(message, header, {
            disableTimeOut: true,
        });
    }

    warning(message: string, header: string): void {
        this.toastrService.warning(message, header, {
        });
    }

    info(message: string, header: string): void {
        this.toastrService.info(message, header, {
         
        });
    }

    show(message: string, header: string): void {
        this.toastrService.show(message, header, {
        });
    }
}

export enum AppMessage {
    DataSaved = 'Record(s) has been saved successfully',
    DataUpdated = 'Record(s) has been saved successfully',
    DataDelete = 'Record(s) has been deleted successfully',
    InvalidSelection = 'Please select one or more records from the list and try again',
    DeleteConfirm = 'You are about to delete ~!Param1!~ record(s). This process can not be reverted. Do you want to continue?',
    InvalidServiceUrl = 'Please configure Service Url for ~Param1~',
    InvalidNavigationUrl = 'Please configure Navigation Url for ~!Param1!~',
    InvalidDocuemtUpload = 'Please select one or more files and try again',
}

import { Injectable } from '@angular/core';

@Injectable()
export class CustomFieldModel
{
    id: number;
    customFieldName: string;
    customFieldCaption: string;
    customFieldControlTypeId: number;
    isCustomFieldMandatory: boolean;
    customFieldGroupName: string;
    customFieldSelectionValue: string;
    groupSortOrder: number;
    controlSortOrder: number;
}

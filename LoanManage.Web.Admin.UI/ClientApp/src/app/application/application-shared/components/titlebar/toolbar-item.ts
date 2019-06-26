import { Injectable } from '@angular/core';


//ToolbarItem is class which is liable to populate toolbar individual item
@Injectable()
export class ToolbarItem
{
    id: number;
    sortOrder: number;
    location: string;
    widget: string;
    locateInMenu: string;
    visible: boolean;
    disabled: boolean;
    template: any;
    options: ToolbarItemOption;
}

//ToolbarItemOption is the property of ToolbarItem Class
@Injectable()
export class ToolbarItemOption
{
    icon: string;
    text: string;
    onClick: any;
}

import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[show-yes-no]'
})
export class ShowYesNoDirective
{
    @Input('show-yes-no') showYesNo: boolean;

    constructor(el: ElementRef)
    {
        
        el.nativeElement.style.backgroundColor = 'yellow';
    }
}

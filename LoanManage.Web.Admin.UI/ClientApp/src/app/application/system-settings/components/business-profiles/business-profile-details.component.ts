import { Component, ViewChild, AfterContentChecked } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessProfileService } from './../../services/business-profile.service';

import { BusinessProfileGeneralInformationComponent } from './business-profile-general-information.component';
import { AddressComponent } from '../../../system-service/components/address/address-form.component';

@Component({
    selector: 'app-business-profile-details',
    templateUrl: './business-profile-details.component.html',
    styleUrls: ['./business-profile-details.component.scss']
})

export class BusinessProfileDetailsComponent implements AfterContentChecked
{
   
    tabs: any = [];
    addressComponentKey = 'entity-addresses';

    //entityModel: EntityModel = new EntityModel();

    businessProfileId: any = 0;

    @ViewChild(BusinessProfileGeneralInformationComponent)
    private bpGeneralInformationComponent: BusinessProfileGeneralInformationComponent;

    businessProfileUniqueRowId:any;

    constructor(private route: ActivatedRoute
        , private router: Router, private businessProfileService: BusinessProfileService)
    {
        this.route.params.subscribe(params =>
        {
            if (params['businessProfileId']!= null && params['businessProfileId'] != undefined) {
                this.businessProfileId = params['businessProfileId'];
            }
        });


        this.initTabs();
    }

    ngAfterContentChecked(): void {
        
    }

    initTabs(): void
    {
        this.businessProfileService.getBusinessProfilePageDetails(this.businessProfileId).subscribe(data =>
        {
            this.tabs = data.result.tabItems
        });
    }
}

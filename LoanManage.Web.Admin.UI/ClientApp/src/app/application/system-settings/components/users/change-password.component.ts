import { Component, ViewChild, OnInit, AfterContentChecked, AfterViewInit } from '@angular/core';
import { TitlebarComponent } from '../../../application-shared/components/titlebar/titlebar.component';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { MessageService } from '../../../../shared/services/message.service';
import { NavigationService } from '../../../../shared/services/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailPageAction, ToolbarType } from '../../../application-shared/components/titlebar/utilities';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
/** change-password component*/
export class ChangePasswordComponent implements OnInit, AfterViewInit{
    
   
    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    formData: any = {};
    toolbarType: ToolbarType = ToolbarType.DetailPage;

    constructor(private userService: UserService,
        private messageService: MessageService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private router: Router){
        
    }

    ngOnInit(): void
    {
        this.init();         
    }

    ngAfterViewInit(): void {
        this.titlebar.initializeToolbar("Change Password", null, this.toolbarType);        
    }

    init(): void
    {
        this.userService.getChangePassword().toPromise().then((response: any) =>
        {
            this.formData = response.result;//set property            
        });
    }


    saveEntity(action: DetailPageAction): void
    {
        this.userService.changePassword(this.formData).subscribe(data =>
        {
            this.messageService.success("Record has been saved successfully", 'Information');

            this.redirectToListPage(action);
        });
    }

    redirectToListPage(action: DetailPageAction): void
    {
        this.navigationService.navigateToReturnurl(this.router.url);
    }

    /**
    * validate and save data
    */
    validateAndSave(action: DetailPageAction): void
    {

        if (!this.formValidation.instance.validate().isValid) {
            return;
        }

        this.saveEntity(action);
    }

    /**
     * on save button clicked
     */
    onSaveClicked(e): void
    {

        this.validateAndSave(DetailPageAction.Save);
    }

    /**
    * on close button clicked
    */
    onCloseClicked(e): void
    {
        this.redirectToListPage(DetailPageAction.Close);
    }

}

import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject } from 'rxjs';
import { map, startWith} from 'rxjs/operators';
//import { ProductsService } from '../../_core/services/index';
import { SubheaderService } from '../../../../core/services/layout/subheader.service';
import { LoanApplicationService } from '../../../../core/services/loan-application.service';

import { SpinnerButtonOptions } from '../../../partials/content/general/spinner-button/button-options.interface';
import { ChangeDetectorRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { DxTabPanelModule, DxCheckBoxModule, DxTemplateModule, 
	DxToolbarModule, DxDataGridModule, DxSelectBoxModule, DxButtonModule, 
	DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxTextAreaModule, 
    DxFormModule, DxNumberBoxModule, DxColorBoxModule, DxMultiViewModule, DxRadioGroupModule,
    DxValidationGroupComponent
	, DxTreeListModule, DxFileUploaderModule, DxTagBoxModule, DxDropDownBoxModule } from 'devextreme-angular';

//declare var $: any;


@Component({
	selector: 'm-application-details',
    templateUrl: './application-details.component.html',
    styleUrls: ['./application-details.style.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationDetailsComponent implements AfterViewInit {
    
    contactDataSource: any = [];
    applicationDataSource: any = [];

    genderSelectItems: any = [];
    applicationStatusTypeSelectItems: any = [];
    branchSelectItems: any = [];
    loanTypeSelectItems: any = [];
    applicationCustomFields: any = [];
    temporaryDataSource: any = [];

    showGroup: any = "card mb-1 item-visible";
    hideGroup: any = "card mb-1 item-invisible";
    customFieldClassGroup: any = this.hideGroup;

    showInitialGroup: any = "row form-group  item-visible";
    hideInitialGroup: any = "row form-group  item-invisible";
    initialClassGroup: any = this.showInitialGroup;

    minDate: Date = new Date(1900, 0, 1);
    nowDate: Date = new Date();
    maxDate: Date = new Date(this.nowDate.getFullYear() - 18, this.nowDate.getMonth(), this.nowDate.getDate());
    contentClass: any = "detail-page-content-div";

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

   
    applicationId: any = 0;

    entityTitle: string = "Application";
    loanTypeId: any = 0;
    isSubmitted: boolean = false;

	/**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    constructor(private loanService: LoanApplicationService,   
        private ref: ChangeDetectorRef,    
        private route: ActivatedRoute,
        private router: Router) {

        
            route.queryParams.subscribe(params => {
                if (params['id'] !== undefined) {
                    this.applicationId = params['id'];               
                }
            });
		
		//this.init();
    }

    ngOnInit(): void {
        this.init();
    }

    ngAfterViewInit(): void {
        this.formValidation.instance.validate();

        if (this.applicationId > 0)
        {
            this.customFieldClassGroup = this.showGroup;
            this.initialClassGroup = this.hideInitialGroup;
        }
    }

   

   
    /**
    * on save button clicked
    */
    onSaveClicked(e): void {
        
        //this.validateAndSave(DetailPageAction.Save);
    }

    /**
     * on save and new button clicked
     */
    onSaveNNewClicked(e): void {
        

        //this.validateAndSave(DetailPageAction.SaveAndNew);
    }

    /**
     * on save and close button clicked
     */
    onSaveNCloseClicked(e): void {
        

        //this.validateAndSave(DetailPageAction.SaveAndClose);
    }

    /**
    * on close button clicked
    */
    onCloseClicked(e): void {

        
        //this.redirectToListPage(DetailPageAction.Close);
    }

    /************************************************ Method Start *********************************** */

   
    // /**
    //  * Init method
    //  **/
    // init(): void {

    //     this.loanService.getApplication(this.applicationId).toPromise().then((response: any) => {
    //         this.spinner.active = true,
	// 			this.genderSelectItems = response.result.genderSelectItems,
	// 			this.applicationStatusTypeSelectItems = response.result.applicationStatusTypeSelectItems,
	// 			this.branchSelectItems = response.result.branchSelectItems,
	// 			this.loanTypeSelectItems = response.result.loanTypeSelectItems,

	// 			this.contactDataSource = response.result.loanApplicationModel.contact,
    //             this.applicationDataSource = response.result.loanApplicationModel,
    //            // this.form.valid,	
    //             this.isSubmitted = this.applicationDataSource.isSubmitted,                
    //             this.spinner.active = false;
    //             //this.ref.markForCheck();
    //             this.ref.detectChanges();
                          
    //     });

    // }

     /**
     * Init method
     **/
    init(): void {

        //this.loanService.getApplication(this.applicationId).subscribe(data => {
            this.loanService.getApplication(this.applicationId).toPromise().then((data: any) => {
            this.genderSelectItems = data.result.genderSelectItems,
                this.applicationStatusTypeSelectItems = data.result.applicationStatusTypeSelectItems,
                this.branchSelectItems = data.result.branchSelectItems,
                this.loanTypeSelectItems = data.result.loanTypeSelectItems,

                this.applicationDataSource = data.result.loanApplicationModel,
                this.applicationCustomFields = data.result.loanApplicationModel.applicationCustomFields,
                this.isSubmitted = this.applicationDataSource.isSubmitted,   
                this.contactDataSource = data.result.loanApplicationModel.contact,               
                this.ref.detectChanges();

        });

    }

    onCustomFieldvalueChanged(e, data) {
        //debugger;
        let exists = false;        

        // iterate over each element in the array
        for (var i = 0; i < this.temporaryDataSource.length; i++) {

            if (this.temporaryDataSource[i].id == data.id) {
                //add to the targetted array
                //this.target.push(this.subCategorySelectItems[i]);
                this.temporaryDataSource[i].value = e.value;
                exists = true;
            }
        }

        if (!exists) {
            this.temporaryDataSource.push(data);
        }
    }
  

    /**
     * 
     * @param closedWindow
     * @param isNew
     */
    saveEntity(): void {      
       

        if (this.applicationId == 0) {
            this.loanService.createApplication("", this.applicationDataSource).subscribe(data => {                             
                this.applicationId = data.result;
                this.customFieldClassGroup = this.showGroup;
                this.init();

                if (this.applicationId > 0) {
                    this.customFieldClassGroup = this.showGroup;
                    this.initialClassGroup = this.hideInitialGroup;
                }
                
                this.ref.detectChanges();
            });
        }
        else {

            this.applicationDataSource.applicationCustomFields = this.temporaryDataSource;
            this.loanService.updateApplication("", this.applicationDataSource).subscribe(data => {
                this.applicationId = data.result;   
                this.customFieldClassGroup = this.showGroup;
                this.init();
                this.ref.detectChanges();            
            });
        }
    }

    /**
     * validate and save data
     */
    validateAndSave(): void {
        //debugger;
        if (!this.formValidation.instance.validate().isValid) {
            return;
        }
        this.saveEntity();
    }

    /**
     * validate and save data
     */
    validateAndSaveAndSubmit(): void {

        if (!this.formValidation.instance.validate().isValid) {
            return;
        }    
            if(this.applicationDataSource != undefined && this.applicationDataSource != null){
                this.applicationDataSource.isSubmitted = true;
            }       
            this.saveEntity();
           
    }
}


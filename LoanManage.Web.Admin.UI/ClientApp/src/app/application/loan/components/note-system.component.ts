import { Component, AfterViewInit, ViewChild, OnInit, Input, AfterViewChecked } from '@angular/core';
import { DxValidationGroupComponent } from 'devextreme-angular';
import { LoanApplicationService } from '../services/loan-application.service';
import { MessageService } from './../../../shared/services/message.service';
import { TitlebarComponent } from './../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../application-shared/components/titlebar/utilities';
import { NavigationService } from '../../../shared/services/navigation.service';
import CustomStore from "devextreme/data/custom_store";
import { DxNumberBoxComponent, DxTextBoxComponent, DxTextAreaComponent, DxSelectBoxComponent, DxDataGridComponent, DxButtonComponent, DxRadioGroupComponent, DxTextAreaModule } from 'devextreme-angular';
import { EntityModel } from '../../system-service/models/entityModel';
import { ToolbarItem, ToolbarItemOption } from '../../application-shared/components/titlebar/toolbar-item';
import { ApprovalStatusMapType, LoanStatusMapType, ApproverGroupTypeMapType } from '../../application-shared/components/titlebar/utilities';
declare var $: any;

@Component({
    selector: 'app-system-note',
    templateUrl: './note-system.component.html',
    styleUrls: ['./note-system.component.scss'],
})

export class NoteSystemComponent implements AfterViewChecked {


    applicationNoteList: any = [];
    loanApplicationModel: any = [];
    applicationId: any = 0;
    loanStatusMapTypeId: any = 0;
    disableItem: boolean = true;
    assignedContactId: any = 0;
    loggedInUserContactId: any = 0;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    entityTitle: string = "Checklist";
    toolbarType: ToolbarType = ToolbarType.DetailPage;


	/**
     * Constructor
     * @param roleService
     * @param userService
     * @param messageService
     * @param route
     * @param router
     */
    constructor(private loanService: LoanApplicationService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.route.params.subscribe(params => {
            if (params['applicationId'] !== undefined) {
                this.applicationId = params['applicationId'];
                this.toolbarType = ToolbarType.DetailPage;
            }
        });


    }

    ngOnInit(): void {

        //if(this.applicationId > 0)
        //    this.addToolbarAdditionalItems();
        this.init();
    }

    ngAfterViewInit(): void {


    }



    ngAfterViewChecked(): void {
        // ...

    }

    /************************************************ Method Start *********************************** */


    /**
     * Init method
     **/
    init(): void {

        this.loanService.getApplicationSystemNoteList(this.applicationId).subscribe(data => {

            this.applicationNoteList = data.result.noteList,
                //this.loanApplicationModel = data.result.loanApplicationModel,
                //this.setApprovalConfiguration(data.result.loanApplicationModel),
                this.titlebar.initializeToolbar("System Note", null, this.toolbarType, this.disableItem);
        });

    }

    setApprovalConfiguration(model) {

        if (this.applicationId > 0) {

            this.loanStatusMapTypeId = model.loanStatusMapTypeId;
            this.assignedContactId = model.AssignedContactId;
            this.loggedInUserContactId = model.LoginUserId;



            //if the loan is not started
            if (this.loanStatusMapTypeId == LoanStatusMapType.NotStarted) {
                this.disableItem = false;
            }
            else if (this.loanStatusMapTypeId == LoanStatusMapType.InProgress) {
                this.disableItem = false;
            }
            else if (this.loanStatusMapTypeId == LoanStatusMapType.Approved) {
                this.disableItem = true;
            }
            else if (this.loanStatusMapTypeId == LoanStatusMapType.Rejected) {
                this.disableItem = true;
            }
        }
    }

    /*****************************  Credit Officer Start ******************************** */



    validateAndSave(action: DetailPageAction): void {

        this.saveEntity(action);
    }


    saveEntity(action: DetailPageAction): void {

        
        this.loanService.updateSystemNoteList(this.applicationNoteList).subscribe(data => {
            this.messageService.success("Record has been saved successfully", 'Information');
            this.init();
        });

    }

    redirectToListPage(action: DetailPageAction): void {
        //debugger;
        var newNavigationUrl = '/loan/applications';


        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.applicationId, this.router.url);
        }
    }

    onSaveClicked(e): void {
        this.validateAndSave(DetailPageAction.Save);
    }

    onSaveNNewClicked(e): void {
        this.validateAndSave(DetailPageAction.SaveAndNew);
    }

    onSaveNCloseClicked(e): void {
        this.validateAndSave(DetailPageAction.SaveAndClose);
    }

    onCloseClicked(e): void {
        this.redirectToListPage(DetailPageAction.Close);
    }

    onDeleteNote(data): void {

        this.loanService.deleteNoteRecord(data).subscribe(data => {
            this.messageService.success("Record has been deleted successfully", 'Information');
            this.init();
        });

    }

    addNewNote(e) {
        //debugger;
        let tempId = Math.floor(Math.random() * Math.floor(100000)) + Math.floor(Math.random() * Math.floor(1000000)) * -1;
        var spd = new NoteModel();
        spd.id = 0;
        spd.entityTypeId = 0
        spd.entityId = this.applicationId;
        spd.noteDetail = '';
        spd.responseDetail = '';
        spd.isPrivate = false;
        spd.createdBy = '';
        spd.createdByContactId = 0;
        spd.noteTypeId = 0;
        spd.assignedByPhotoUrl = '';
        spd.assignedToPhotoUrl = '';
        spd.createdFor = '';
        spd.isAssignedToMe = false;
        this.applicationNoteList.push(spd);
    }
}


export class NoteModel {
    id: any;
    entityTypeId: any;
    entityId: any;
    noteDetail: any;
    responseDetail: any;   
    isPrivate: boolean;
    createdBy: any;
    createdByContactId: any;
    noteTypeId: any;
    assignedByPhotoUrl: any;
    assignedToPhotoUrl: any;
    createdFor: any;
    isAssignedToMe: boolean;
}

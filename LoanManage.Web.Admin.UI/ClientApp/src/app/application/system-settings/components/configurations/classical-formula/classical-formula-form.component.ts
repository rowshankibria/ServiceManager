import { Component, AfterViewInit, ViewChild, OnInit, Input } from '@angular/core';
import { DxValidationGroupComponent, DxTreeListComponent, DxValidatorComponent } from 'devextreme-angular';
import { ClassicalFormulaService } from '../../../services/classical-formula.service';
import { MessageService } from './../../../../../shared/services/message.service';
import { TitlebarComponent } from './../../../../application-shared/components/titlebar/titlebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarType, DetailPageAction } from './../../../../application-shared/components/titlebar/utilities';
import { NavigationService } from '../../../../../shared/services/navigation.service';
import { EntityModel } from '../../../../system-service/models/entityModel';
import CustomStore from "devextreme/data/custom_store";
import DataSource from 'devextreme/data/data_source';
import { DxCheckBoxComponent, DxTextBoxComponent, DxNumberBoxComponent, DxDataGridComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { ToolbarItem } from '../../../../application-shared/components/titlebar/toolbar-item';
declare var $: any;

@Component({
    selector: 'app-classical-formula-form',
    templateUrl: './classical-formula-form.component.html',
    styleUrls: ['./classical-formula-form.component.scss']
})
/** role-form component*/
export class ClassicalFormulaFormComponent implements AfterViewInit {


    availableHerbDataSource: any = [];
    formulaHerbDataSource: any = [];
    tempDataSource: any = [];

    formula: any = [];
    formulaCategorySelectedItem: any = [];
    formulaSubCategorySelectedFilteredItem: any = [];
    formulaSubCategorySelectedItem: any = [];
    formulaId: any = 0;

    selectedRowsForAvailable: any = [];
    selectedRowsForFormula: any = [];
    formulaHerbList: any = [];
    formulaHerbModelList: any = [];
    toolbarAdditionalItems: ToolbarItem[];
    contentClass: any = "detail-page-content-div";

    @ViewChild(TitlebarComponent)
    private titlebar: TitlebarComponent;

    @ViewChild('grdFormulaHerb')
    grdFormulaHerb: DxDataGridComponent;

    @ViewChild('grdAvailableHerb')
    grdAvailableHerb: DxDataGridComponent;

    @ViewChild('formValidation')
    private formValidation: DxValidationGroupComponent;

    @ViewChild('formulaCategoryValidation')
    private formulaCategoryValidation: DxValidatorComponent;

    @ViewChild('formulaSubCategoryValidation')
    private formulaSubCategoryValidation: DxValidatorComponent;

    @ViewChild('classicalFormulaNameValidation')
    private classicalFormulaNameValidation: DxValidatorComponent;


    constructor(private formulaService: ClassicalFormulaService
        , private messageService: MessageService
        , private navigationService: NavigationService
        , private route: ActivatedRoute
        , private router: Router) {

        this.route.params.subscribe(params => {
            if (params['formulaId'] != undefined) {
                this.formulaId = params['formulaId'];
            }
        });

        this.toolbarAdditionalItems = [];
    }


    /*
     * add additional menu item
     **/
    addAdditionalToolbar() {

        ////expand menu
        //var expandItem = new ToolbarItem();
        //expandItem.location = 'after';
        //expandItem.widget = 'dxButton';
        //expandItem.locateInMenu = 'auto';
        //expandItem.visible = true;
        //expandItem.disabled = false;

        //var expandItemOption = new ToolbarItemOption();
        //expandItemOption.icon = 'chevrondown';
        //expandItemOption.text = 'Expand';
        //expandItemOption.onClick = () => {
        //    this.onExpandClicked();
        //};
        //expandItem.options = expandItemOption;
        //this.toolbarAdditionalItems.push(expandItem);

        ////collapse menu
        //var collapseItem = new ToolbarItem();
        //collapseItem.location = 'after';
        //collapseItem.widget = 'dxButton';
        //collapseItem.locateInMenu = 'auto';
        //collapseItem.visible = true;
        //collapseItem.disabled = false;

        //var collapseItemOption = new ToolbarItemOption();
        //collapseItemOption.icon = 'chevronup';
        //collapseItemOption.text = 'Collapse';
        //collapseItemOption.onClick = () => {
        //    this.onCollapseClicked();
        //};
        //collapseItem.options = collapseItemOption;
        //this.toolbarAdditionalItems.push(collapseItem);

    }

    ngAfterViewInit(): void {
        this.attachValidationToControl();
    }

    ngOnInit(): void {
        this.addAdditionalToolbar();
        this.init();
    }

    init(): void {
        this.formulaService.getClassicalFormula(this.formulaId).subscribe(data => {

            this.formula = data.result.formula,
                this.formulaHerbList = data.result.formula.formulaHerbList,
                this.formulaHerbModelList = data.result.formula.formulaHerbModelList,
                this.formulaCategorySelectedItem = data.result.formulaCategorySelectedItem,
                this.formulaSubCategorySelectedItem = data.result.formulaSubCategorySelectedItem,
                this.titlebar.initializeToolbar(data.result.role == undefined ? "Classical Formula : New " : "Classical Formula : " + data.result.formula.name, this.toolbarAdditionalItems, ToolbarType.DetailPage);
        });
       
        this.loadFormulaHerbDataSource();
        this.loadAvailableHerbDataSource();
    }

    /**
     * load formula herb data source
     * */
    loadFormulaHerbDataSource(): void {

        if (this.formulaId !== undefined && this.formulaId !== null && this.formulaId != 0) {

            this.formulaHerbDataSource = new DataSource({
                load: (loadOptions: any) => {
                    return this.formulaService.getFormulaHerbByFormulaId(this.formulaId, loadOptions).toPromise().then((response: any) => {
                        return {
                            data: response.result.data,
                            totalCount: response.result.totalCount
                        }

                    });
                }
            });
        }

    }

    /**
     * load available herb data source
     *
     * */
    loadAvailableHerbDataSource(): void {

        this.availableHerbDataSource = new DataSource({
            load: (loadOptions: any) => {
                return this.formulaService.getAvailableHerbByFormulaId(this.formulaId, loadOptions).toPromise().then((response: any) => {
                    return {
                        data: response.result.data,
                        totalCount: response.result.totalCount
                    }

                });
            }
        });

    }

    /**
     * on category value changed
     * @param e
     */
    onCategoryValueChanged(e): void {
        let value = e.value;
        if (value != undefined && value != null) {
            this.formulaSubCategorySelectedFilteredItem = this.formulaSubCategorySelectedItem.filter(x => x.tag == value);
        }
    }

    /**
    * on value change for numeric control
    */
    onNumericControlValueChanged(e, data) {
        //debugger;
        if (e.value === null) {
            e.component.option("value", 0);
        }

        if (e.value != null && e.value != undefined) {

            var model = new SelectClientModel();
            model.id = data.key.id;
            model.dose = e.value;
            this.formulaHerbModelList.push(model);
        }
    }

    /**
     * delete records
     **/
    deleteRecord(): void {        
        let data = this.tempDataSource;
        this.formulaService.deleteClassicalFormulaDetail(data.key.id).subscribe(data => {
            this.messageService.success("Record has been save successfully", 'Information');
            this.grdFormulaHerb.instance.refresh();
            this.grdAvailableHerb.instance.refresh();
        });

    }

    /**
     * go to detail page udate record
     * @param data
     */
    onDeleteClicked(data: any) {        
        this.tempDataSource = data;
        var result = this.messageService.showDeleteConfirmMsg(1);
        result.then(dialogResult => {
            if (dialogResult) {
                this.deleteRecord();
            }
        });
    }

    /**
     * attach validation to the controls
     *
     * */
    attachValidationToControl() {

        //validation        
        this.formulaCategoryValidation.validationRules = [{ type: 'required', message: 'Root Category is required.' }];
        this.formulaSubCategoryValidation.validationRules = [{ type: 'required', message: 'Child Category is required.' }];
        this.classicalFormulaNameValidation.validationRules = [{ type: 'required', message: 'Name is required.' }];
    }


    /**
     * validate and save data
     */
    validateAndSave(action: DetailPageAction): void {

        if (!this.formValidation.instance.validate().isValid) {
            return;
        }

        this.saveEntity(action);
    }

    /**
     * 
     * @param closedWindow
     * @param isNew
     */
    saveEntity(action: DetailPageAction): void {

        this.getSelectedAvailableHerb();

        if (this.formulaId !== undefined && this.formulaId !== null && this.formulaId != 0) {

            this.formulaService.updateClassicalFormula(this.formula).subscribe(data => {
                this.messageService.success("Record has been update successfully", 'Information');
                this.formulaId = data.result;
                this.grdFormulaHerb.instance.refresh();
                this.selectedRowsForAvailable = [];
                this.grdAvailableHerb.instance.refresh();
                this.redirectToListPage(action);
            });
        }
        else {

            this.formulaService.createClassicalFormula(this.formula).subscribe(data => {
                this.messageService.success("Record has been save successfully", 'Information');
                this.formulaId = data.result;
                this.grdFormulaHerb.instance.refresh();
                this.selectedRowsForAvailable = [];
                this.grdAvailableHerb.instance.refresh();                
                this.redirectToListPage(action);
            });
        }
    }

    /**
    * get selected available herb
    */
    getSelectedAvailableHerb(): void {
        //debugger;
        // iterate over each element in the array
        for (var i = 0; i < this.grdAvailableHerb.selectedRowKeys.length; i++) {
            //add to the targetted array
            this.formulaHerbList.push(this.grdAvailableHerb.selectedRowKeys[i].id);
        }
    }

    /**
    * on save button clicked
    */
    onSaveClicked(e): void {
        this.validateAndSave(DetailPageAction.Save);
    }

    /**
     * on save and new button clicked
     */
    onSaveNNewClicked(): void {
        this.validateAndSave(DetailPageAction.SaveAndNew);
    }

    /**
     * on save and close button clicked
     */
    onSaveNCloseClicked(): void {

        this.validateAndSave(DetailPageAction.SaveAndClose);
    }
    /**
     * on close button clicked
     */
    onCloseClicked(): void {
        this.redirectToListPage(DetailPageAction.Close);
    }

    /**
    * redirect to list page
    */
    redirectToListPage(action: DetailPageAction): void {
        var newNavigationUrl = '/system-settings/role';

        if (action == DetailPageAction.Close || action == DetailPageAction.SaveAndClose) {

            this.navigationService.navigateToReturnurl(this.router.url);
        }
        else if (action == DetailPageAction.SaveAndNew) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl, this.router.url);
        }
        else if (action == DetailPageAction.Save && newNavigationUrl == this.router.url) {

            this.navigationService.navigateAndUpdateReturnUrl(newNavigationUrl + '/' + this.formulaId, this.router.url);
        }
        else {
            this.titlebar.setToolbarTitle("Role : " + this.formula.name);
        }
    }
}


export class SelectClientModel {

    id: number;
    pinYin: string;
    englishName: string;
    pharmaceuticalName: string;
    australianApprovedName: string;
    dose: number;
}

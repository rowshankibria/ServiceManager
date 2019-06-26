import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../shared/services/api-http.service';

@Injectable()
export class EmployeeService {
    

    constructor(private apiHttpService: ApiHttpService) {

    }
     
    getEmployeeSelectBoxData( bpId: number) {
        let url = 'hrm/employee/get-employee-select-box-items/' + bpId;
        
        return this.apiHttpService.GET(url);
    }


    getEmployeePageTabs(id: any) {
        let url = 'hrm/employee/get-employee-page-tabs/' + id;
        return this.apiHttpService.GET(url);
    }


    getEmployeeDetails(id: any) {
        let url = 'hrm/employee/get-employee-by-id/' + id;
        return this.apiHttpService.GET(url);
    }

    createEmployee(fileName: any,data: any) {
        let url = 'hrm/employee/create-employee?imageFileName=' + fileName;
        return this.apiHttpService.POST(url, data);
    }

    updateEmployee(fileName: any, id: any, data: any) {
        let url = 'hrm/employee/update-employee/' + id + '?imageFileName=' + fileName;
        return this.apiHttpService.PUT(url, data);
    }

    getSupervisorServiceUrl(bpId: number, empId: number): string {
        return 'hrm/employee/get-supervisor-list/' + bpId + '/' + empId;
    }

    getSupervisorColumns(): any {
        return [
            {
                "dataField": "name",
                "caption": "Name"
            },
            {
                "dataField": "position",
                "caption": "Position"
            }];
    }

    getBPSiteServiceUrl(bpId: number): string {
        return 'service/business-profile-site/get-business-profile-site-select-items/' + bpId;
    }

    getBPSiteColumns(): any {
        return [
            {
                "dataField": "name",
                "caption": "Name"
            },
            {
                "dataField": "address",
                "caption": "Address"
            }];
    }

    getCostCentreServiceUrl(bpId: number): string {
        return 'service/cost-centre/get-cost-centre-select-items/' + bpId;
    }

    getCostCentreColumns(): any {
        return [
            {
                "dataField": "name",
                "caption": "Cost Centre"
            }];
    }
    
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var PatientService = /** @class */ (function () {
    function PatientService(apiHttpService) {
        this.apiHttpService = apiHttpService;
        this.url = '';
    }
    PatientService.prototype.getDxGridRecords = function (id, params) {
        this.url = 'herb/patient/get-patient-company-list/' + id;
        return this.apiHttpService.GETDXGrid(this.url, params);
    };
    /**
     * get contact page details
     * @param id
     */
    PatientService.prototype.getContactPageDetails = function (id) {
        this.url = 'herb/patient/get-patient-details-tab?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    PatientService.prototype.getBusinessProfileIdListByPractitionerId = function (id) {
        this.url = 'herb/patient/get-practitioner-businessprofile-list?id=' + id;
        return this.apiHttpService.GET(this.url);
    };
    PatientService.prototype.getContact = function (id, practitionerId) {
        this.url = 'herb/patient/get-patient?id=' + id + '&practitionerId=' + practitionerId + '&isPortal=false';
        return this.apiHttpService.GET(this.url);
    };
    PatientService.prototype.getCompanyByBusinessProfile = function (ids) {
        this.url = 'herb/patient/get-patient-company-list';
        return this.apiHttpService.POST(this.url, ids);
    };
    PatientService.prototype.getPractitionerByBusinessProfile = function (ids) {
        this.url = 'herb/patient/get-practitioner-by-businessprofile-list';
        return this.apiHttpService.POST(this.url, ids);
    };
    PatientService.prototype.createContact = function (fileName, data) {
        this.url = 'herb/patient/create-patient?imageFileName=' + fileName;
        return this.apiHttpService.POST(this.url, data);
    };
    PatientService.prototype.updateContact = function (fileName, data) {
        this.url = 'herb/patient/update-patient?imageFileName=' + fileName;
        return this.apiHttpService.PUT(this.url, data);
    };
    PatientService = __decorate([
        core_1.Injectable()
    ], PatientService);
    return PatientService;
}());
exports.PatientService = PatientService;
//# sourceMappingURL=patient.service.js.map
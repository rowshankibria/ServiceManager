"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ClassicalFormulaService = /** @class */ (function () {
    function ClassicalFormulaService(apiHttpService) {
        this.apiHttpService = apiHttpService;
        this.url = '';
    }
    ClassicalFormulaService.prototype.getClassicalFormula = function (id) {
        this.url = 'herb/configurations/get-classical-Formula?id=' + id;
        ;
        return this.apiHttpService.GET(this.url);
    };
    ClassicalFormulaService.prototype.createClassicalFormula = function (data) {
        this.url = 'herb/configurations/create-classical-formula';
        return this.apiHttpService.POST(this.url, data);
    };
    ClassicalFormulaService.prototype.updateClassicalFormula = function (data) {
        this.url = 'herb/configurations/update-classical-formula';
        return this.apiHttpService.PUT(this.url, data);
    };
    ClassicalFormulaService.prototype.deleteClassicalFormula = function (id) {
        this.url = 'herb/configurations/delete-classical-formula/' + id;
        return this.apiHttpService.DELETE(this.url);
    };
    ClassicalFormulaService.prototype.deleteClassicalFormulaDetail = function (id) {
        this.url = 'herb/configurations/delete-classical-formula-detail/' + id;
        return this.apiHttpService.DELETE(this.url);
    };
    ClassicalFormulaService.prototype.deleteClassicalFormulas = function (ids) {
        this.url = 'herb/configurations/delete-classical-formulas/';
        return this.apiHttpService.POST(this.url, ids);
    };
    ClassicalFormulaService.prototype.getAvailableHerbByFormulaId = function (formulaId, params) {
        this.url = 'herb/configurations/get-classical-formula-herb-available/' + formulaId;
        return this.apiHttpService.GETGridData(this.url, params);
    };
    ClassicalFormulaService.prototype.getFormulaHerbByFormulaId = function (formulaId, params) {
        this.url = 'herb/configurations/get-classical-formula-herb-detail/' + formulaId;
        return this.apiHttpService.GETGridData(this.url, params);
    };
    ClassicalFormulaService = __decorate([
        core_1.Injectable()
    ], ClassicalFormulaService);
    return ClassicalFormulaService;
}());
exports.ClassicalFormulaService = ClassicalFormulaService;
//# sourceMappingURL=classical-formula.service.js.map
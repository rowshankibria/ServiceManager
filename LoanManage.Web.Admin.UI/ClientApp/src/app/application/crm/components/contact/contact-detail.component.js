"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var entityModel_1 = require("../../../system-service/models/entityModel");
var ContactDetailComponent = /** @class */ (function () {
    function ContactDetailComponent(route, router, contactService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.contactService = contactService;
        this.tabs = [];
        this.entityModel = new entityModel_1.EntityModel();
        this.contactId = 0;
        this.tabPageServiceStyle = 'tab-item-invisible';
        this.route.params.subscribe(function (params) {
            if (params['clientId'] != undefined) {
                _this.contactId = params['clientId'];
            }
        });
        this.entityModel.entityId = this.contactId;
        this.entityModel.entityType = 102;
        //this.initTabs();
    }
    /**
     * initialize tab
     * */
    ContactDetailComponent.prototype.initTabs = function () {
        var _this = this;
        this.contactService.getContactPageDetails(this.contactId).subscribe(function (data) {
            _this.tabs = data.result.tabItems;
        });
    };
    /**
     * Event
     * */
    ContactDetailComponent.prototype.ngAfterViewInit = function () {
        //if it is new mode then hide other tab except primary component
        if (this.contactId != null && this.contactId != undefined) {
            this.tabPageServiceStyle = "tab-item-visible";
        }
    };
    ContactDetailComponent = __decorate([
        core_1.Component({
            selector: '.app-contact-detail',
            templateUrl: './contact-detail.component.html',
            styleUrls: ['./contact-detail.component.scss'],
        })
    ], ContactDetailComponent);
    return ContactDetailComponent;
}());
exports.ContactDetailComponent = ContactDetailComponent;
//# sourceMappingURL=contact-detail.component.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent(applicationMenuService, router) {
        var _this = this;
        this.applicationMenuService = applicationMenuService;
        this.router = router;
        this.imageUrl = "../../../../../assets/img/no-image.png";
        this.isActive = false;
        this.selectedMenu = 'loan-header';
        this.defaultMenu = 'loan-header';
        this.pushRightClass = 'push-right';
        this.router.events.subscribe(function (val) {
            if (val instanceof router_1.NavigationEnd &&
                window.innerWidth <= 992 &&
                _this.isToggled()) {
                _this.toggleSidebar();
            }
        });
    }
    Object.defineProperty(SidebarComponent.prototype, "ApplicationHeader", {
        set: function (header) {
            this.applicationHeader = header;
            if (header != undefined && header.displayName != undefined) {
                this.userName = header.displayName;
                if (header.photoThumbnail != null && header.photoThumbnail != "") {
                    this.imageUrl = "data:image/jpg;base64," + header.photoThumbnail;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    SidebarComponent.prototype.eventCalled = function () {
        this.isActive = !this.isActive;
    };
    SidebarComponent.prototype.addExpandClass = function (elementName) {
        $('.list-group-item').removeClass('menu-selected');
        $('#' + elementName).addClass('menu-selected');
        this.selectedMenu = elementName;
    };
    SidebarComponent.prototype.isToggled = function () {
        var dom = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    };
    SidebarComponent.prototype.toggleSidebar = function () {
        var dom = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    };
    SidebarComponent.prototype.rltAndLtr = function () {
        var dom = document.querySelector('body');
        dom.classList.toggle('rtl');
    };
    SidebarComponent.prototype.onLoggedout = function () {
        localStorage.removeItem('isLoggedin');
    };
    SidebarComponent.prototype.changeLang = function (language) {
    };
    __decorate([
        core_1.Input('ApplicationMenu')
    ], SidebarComponent.prototype, "applicationMenu", void 0);
    __decorate([
        core_1.Input()
    ], SidebarComponent.prototype, "ApplicationHeader", null);
    SidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-sidebar',
            templateUrl: './sidebar.component.html',
            styleUrls: ['./sidebar.component.scss']
        })
    ], SidebarComponent);
    return SidebarComponent;
}());
exports.SidebarComponent = SidebarComponent;
//# sourceMappingURL=sidebar.component.js.map
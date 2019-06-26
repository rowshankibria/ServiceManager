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
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(translate, router, authService) {
        var _this = this;
        this.translate = translate;
        this.router = router;
        this.authService = authService;
        this.pushRightClass = 'push-right';
        this.isAuthorized = true;
        this.imageUrl = "../../../../../assets/img/no-image.png";
        this.router.events.subscribe(function (val) {
            if (val instanceof router_1.NavigationEnd &&
                window.innerWidth <= 992 &&
                _this.isToggled()) {
                _this.toggleSidebar();
            }
        });
    }
    Object.defineProperty(HeaderComponent.prototype, "ApplicationHeader", {
        set: function (header) {
            this.applicationHeader = header;
            if (header != undefined && header.displayName != undefined) {
                this.userName = header.displayName;
            }
        },
        enumerable: true,
        configurable: true
    });
    HeaderComponent.prototype.ngOnInit = function () {
        if (this.authService.isAuthorized()) {
            this.isAuthorized = true;
        }
        else {
            this.isAuthorized = false;
        }
    };
    HeaderComponent.prototype.isToggled = function () {
        var dom = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    };
    HeaderComponent.prototype.toggleSidebar = function () {
        var dom = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    };
    HeaderComponent.prototype.onLoggedout = function () {
        localStorage.removeItem('isLoggedin');
    };
    HeaderComponent.prototype.login = function () {
        //this.authService.login();
    };
    HeaderComponent.prototype.logout = function () {
        this.authService.logout();
    };
    HeaderComponent.prototype.changeLang = function (language) {
        this.translate.use(language);
    };
    __decorate([
        core_1.Input()
    ], HeaderComponent.prototype, "ApplicationHeader", null);
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.scss']
        })
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map
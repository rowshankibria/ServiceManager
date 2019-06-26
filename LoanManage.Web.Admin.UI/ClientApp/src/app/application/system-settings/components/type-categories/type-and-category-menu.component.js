"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var titlebar_component_1 = require("./../../../application-shared/components/titlebar/titlebar.component");
var utilities_1 = require("./../../../application-shared/components/titlebar/utilities");
var TypeAndCategoryComponent = /** @class */ (function () {
    function TypeAndCategoryComponent(typeAndCategoryService, router) {
        this.typeAndCategoryService = typeAndCategoryService;
        this.router = router;
        this.menuDataSource = [];
        this.tabContentHeight = 500;
        this.initialMenuDataSource();
    }
    /*
     * @HostListener
     **/
    TypeAndCategoryComponent.prototype.onResize = function () {
        this.tabContentHeight = window.innerHeight - 110;
    };
    /**
     * ngAfterViewInit event
     */
    TypeAndCategoryComponent.prototype.ngAfterViewInit = function () {
        this.titlebar.initializeToolbar("Types & Categories", null, utilities_1.ToolbarType.LinkPage);
    };
    /**
     * ngOnInit event
     */
    TypeAndCategoryComponent.prototype.ngOnInit = function () {
        this.tabContentHeight = window.innerHeight - 110;
    };
    /**
     * initial type and category tab data source
     */
    TypeAndCategoryComponent.prototype.initialMenuDataSource = function () {
        var _this = this;
        this.typeAndCategoryService.getCustomCategoryTypes().subscribe(function (response) {
            _this.menuDataSource = response.result.customCategoryModules;
        });
    };
    /**
   * on close button clicked
   */
    TypeAndCategoryComponent.prototype.onCloseClicked = function () {
        this.router.navigate(['/']);
    };
    __decorate([
        core_1.ViewChild(titlebar_component_1.TitlebarComponent)
    ], TypeAndCategoryComponent.prototype, "titlebar", void 0);
    __decorate([
        core_1.ViewChild('#tabPanelTypeNCategory')
    ], TypeAndCategoryComponent.prototype, "tabPanelTypeNCategory", void 0);
    __decorate([
        core_1.HostListener('window:resize')
    ], TypeAndCategoryComponent.prototype, "onResize", null);
    TypeAndCategoryComponent = __decorate([
        core_1.Component({
            selector: 'app-type-and-category-menu',
            templateUrl: './type-and-category-menu.component.html',
            styleUrls: ['./type-and-category-menu.component.scss']
        })
    ], TypeAndCategoryComponent);
    return TypeAndCategoryComponent;
}());
exports.TypeAndCategoryComponent = TypeAndCategoryComponent;
//# sourceMappingURL=type-and-category-menu.component.js.map
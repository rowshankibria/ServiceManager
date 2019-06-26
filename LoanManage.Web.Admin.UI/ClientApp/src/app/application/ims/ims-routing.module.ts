import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './../application-shared/components/list/list.component'
import { ImsComponent } from './ims.component';
import { ProductDetailComponent } from './components/product/product-detail.component';
import { ProductFormComponent } from './components/product/product-form.component';


const routes: Routes = [{
    path: '', component: ImsComponent,
    children: [
        { path: 'products', component: ListComponent, data: { title: 'Products' } },
        { path: 'product', component: ProductDetailComponent, data: { title: 'New Product' } },
        { path: 'product/:productId', component: ProductDetailComponent, data: { title: 'Product Detail' } },

    ],
}];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ImsRoutingModule {
}

export const RoutedComponents = [
    ImsComponent
    , ProductDetailComponent
    , ProductFormComponent
];


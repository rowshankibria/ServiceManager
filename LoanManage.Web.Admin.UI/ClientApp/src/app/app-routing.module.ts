import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthenticationGuard } from './shared/services/authentication-guard';


const routes: Routes = [
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: '', loadChildren: './application/application.module#ApplicationModule', canActivate: [AuthenticationGuard] }
    
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

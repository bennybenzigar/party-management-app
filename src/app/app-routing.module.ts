import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthGuard } from './guard/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [{path:'', pathMatch:'full',redirectTo: 'login'},

{path:'login', component:LoginComponent},
{path:'dashboard', canActivate:[AuthGuard],loadChildren:()=>import('./dashboard/dashboard.module').then(m=>m.DashboardModule)},
{ path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

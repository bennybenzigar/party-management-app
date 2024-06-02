import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CreateNewPartyComponent } from './create-new-party/create-new-party.component';
import { ViewPartyComponent } from './view-party/view-party.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'create-party', component: CreateNewPartyComponent },
  { path: 'edit-post/:id', component: CreateNewPartyComponent },
  {path:'view-party/:id',component:ViewPartyComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

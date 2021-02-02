import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashComponent } from './dash/dash.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dash', component: DashComponent },
];
@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class RoutingModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RoutingModule } from './routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashComponent } from './dash/dash.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, DashComponent],
  imports: [BrowserModule, RoutingModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

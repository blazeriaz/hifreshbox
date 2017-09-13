import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FrontComponent } from "front/front.component";
import { HttpModule } from "@angular/http";
import { SharedModule } from "shared.module";
import { FrontRoutingModule } from "front/front.routing";

import { NAV_DROPDOWN_DIRECTIVES } from 'shared/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from 'shared/sidebar.directive';
import { AsideToggleDirective } from 'shared/aside.directive';

import { AuthService, AlertService, RestService } from "services";
import { HomeComponent } from "front/home/home.component";
import { FullLayoutComponent } from "front/layouts/full-layout.component";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,    
    HttpModule,
    FrontRoutingModule
  ],
  declarations: [
    NAV_DROPDOWN_DIRECTIVES,    
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    FrontComponent,
    FullLayoutComponent,
    HomeComponent
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }, AuthService, AlertService, RestService
  ],
  bootstrap: [ FrontComponent ]
})
export class FrontModule { }

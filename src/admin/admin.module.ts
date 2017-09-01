import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AdminComponent } from './admin.component';
import { BreadcrumbsComponent } from 'app/shared/breadcrumb.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from "ngx-bootstrap/modal";

import { NAV_DROPDOWN_DIRECTIVES } from 'app/shared/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from 'app/shared/sidebar.directive';
import { AsideToggleDirective } from 'app/shared/aside.directive';


// Routing Module
import { AdminRoutingModule } from './admin.routing';

import { AlertComponent } from "components";
//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';

import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import {SharedModule} from "shared.module";
import {RestService, AlertService} from "services";



@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    AdminRoutingModule,
    SharedModule,
    HttpModule,
    ReactiveFormsModule
  ],
  declarations: [
    NAV_DROPDOWN_DIRECTIVES,    
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    BreadcrumbsComponent,
    AlertComponent,
    AdminComponent,
    FullLayoutComponent,
    SimpleLayoutComponent
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }, RestService, AlertService
  ],
  bootstrap: [ AdminComponent ]
})
export class AdminModule { }

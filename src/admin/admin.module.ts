import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AdminComponent } from './admin.component';
import { BreadcrumbsComponent } from 'shared/breadcrumb.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from "ngx-bootstrap/modal";

// Routing Module
import { AdminRoutingModule } from './admin.routing';

import { AlertComponent } from "components";
//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';

import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import {SharedModule} from "shared.module";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    AdminRoutingModule,
    SharedModule.forRoot(),
    HttpModule,
    ReactiveFormsModule
  ],
  declarations: [
    BreadcrumbsComponent,
    AdminComponent,
    FullLayoutComponent,
    SimpleLayoutComponent
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [ AdminComponent ]
})
export class AdminModule { }

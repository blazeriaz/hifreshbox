import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FrontComponent } from "front/front.component";
import { HttpModule } from "@angular/http";
import { SharedModule } from "shared.module";
import { FrontRoutingModule } from "front/front.routing";

import { AuthService, AlertService, RestService } from "services";
import { HomeComponent } from "front/home/home.component";
import { MenuComponent } from "front/menu/menu.component";
import { FullLayoutComponent } from "front/layouts/full-layout.component";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),    
    HttpModule,
    FrontRoutingModule
  ],
  declarations: [
    FrontComponent,
    FullLayoutComponent,
    HomeComponent,
    MenuComponent
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

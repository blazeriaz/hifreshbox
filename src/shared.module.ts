import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule } from "@angular/router";

import { ChartsModule } from 'ng2-charts/ng2-charts';

import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService, AlertService, RestService } from "services";
import { AlertComponent } from "components";

import {TooltipModule} from "ngx-tooltip";
import { mgCatalogAttribute } from "pipes";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ChartsModule,
    HttpModule,
    ReactiveFormsModule,
    TooltipModule
  ],
  declarations: [
    AlertComponent,
    mgCatalogAttribute
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    AuthService, AlertService
  ],
  exports: [
    AlertComponent,
    mgCatalogAttribute
  ]
})
export class SharedModule { }

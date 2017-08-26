import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule } from "@angular/router";

import { ChartsModule } from 'ng2-charts/ng2-charts';

import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from "services";

import { emptyLayoutComponent } from './admin/layouts/empty-layout.component';

import {TooltipModule} from "ngx-tooltip";
import { mgCatalogAttribute, mgCatalogImage } from "pipes";

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
    emptyLayoutComponent,
    mgCatalogImage,
    mgCatalogAttribute
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    AuthService
  ],
  exports: [
    emptyLayoutComponent,
    mgCatalogImage,
    mgCatalogAttribute
  ]
})
export class SharedModule { }

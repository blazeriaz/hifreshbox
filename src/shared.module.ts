import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule } from "@angular/router";

import { NAV_DROPDOWN_DIRECTIVES } from 'shared/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from 'shared/sidebar.directive';
import { AsideToggleDirective } from 'shared/aside.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';

import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService, AlertService, RestService, MealMenuService } from "services";

import { emptyLayoutComponent } from './admin/layouts/empty-layout.component';

import {TooltipModule} from "ngx-tooltip";
import { mgCatalogAttribute, mgCatalogImage, jsonParse, zeropad } from "pipes";

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
    NAV_DROPDOWN_DIRECTIVES,    
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    emptyLayoutComponent,
    mgCatalogImage,
    mgCatalogAttribute,
    jsonParse, zeropad
  ],
  providers: [
  ],
  exports: [        
    NAV_DROPDOWN_DIRECTIVES,    
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    emptyLayoutComponent,
    mgCatalogImage,
    mgCatalogAttribute,
    jsonParse, zeropad
  ]
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [ AuthService, RestService, AlertService, MealMenuService ]
    }
  }
}

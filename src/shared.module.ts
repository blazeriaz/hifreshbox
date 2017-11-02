import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NAV_DROPDOWN_DIRECTIVES } from 'shared/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from 'shared/sidebar.directive';
import { AsideToggleDirective } from 'shared/aside.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';

import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService, AlertService, RestService, MealMenuService, RestDefaultService } from "services";

import { emptyLayoutComponent } from './admin/layouts/empty-layout.component';

import { mgCatalogAttribute, mgCatalogImage, jsonParse, zeropad } from 'pipes';
import { AlertComponent } from 'components';
import { HoverClassDirective } from 'shared/hover-class.directive';
import { NewsletterComponent } from 'front/blocks/newsletter.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ChartsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  declarations: [
    NAV_DROPDOWN_DIRECTIVES,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    HoverClassDirective,
    AlertComponent,
    emptyLayoutComponent,
    NewsletterComponent,
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
    HoverClassDirective,
    AlertComponent,
    emptyLayoutComponent,
    NewsletterComponent,
    mgCatalogImage,
    mgCatalogAttribute,
    jsonParse, zeropad
  ]
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [ AuthService, RestService, RestDefaultService, AlertService, MealMenuService ]
    }
  }
}

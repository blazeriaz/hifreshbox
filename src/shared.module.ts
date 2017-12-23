import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NAV_DROPDOWN_DIRECTIVES } from 'shared/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from 'shared/sidebar.directive';
import { AsideToggleDirective } from 'shared/aside.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import {DndModule} from 'ng2-dnd';

import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService, AlertService, RestService, MealMenuService, RestDefaultService, CartService } from "services";

import { emptyLayoutComponent } from './admin/layouts/empty-layout.component';

import { mgCatalogAttribute, mgCatalogImage, jsonParse, zeropad } from 'pipes';
import { AlertComponent } from 'components';
import { HoverClassDirective } from 'shared/hover-class.directive';
import { NewsletterComponent } from 'front/blocks/newsletter.component';
import { TestimonialComponent } from 'front/blocks/testimonial.component';
import { SubscriptionInfoComponent } from 'front/blocks/subscription.info.component';
import { CarouselModule, BsDatepickerModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ChartsModule,
    HttpModule,
    ReactiveFormsModule,
    CarouselModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DndModule.forRoot()
  ],
  declarations: [
    NAV_DROPDOWN_DIRECTIVES,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    HoverClassDirective,
    AlertComponent,
    emptyLayoutComponent,
    NewsletterComponent,
    TestimonialComponent,
    SubscriptionInfoComponent,
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
    TestimonialComponent,
    SubscriptionInfoComponent,
    mgCatalogImage,
    mgCatalogAttribute,
    jsonParse, zeropad
  ]
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [ AuthService, RestService, RestDefaultService, AlertService, MealMenuService, CartService ]
    }
  }
}

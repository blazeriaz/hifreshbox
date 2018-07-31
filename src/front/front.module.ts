import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, CommonModule, DatePipe, PathLocationStrategy } from '@angular/common';
import { FrontComponent } from "./front.component";
import { HttpModule } from "@angular/http";
import { SharedModule } from "shared.module";
import { FrontRoutingModule } from "./front.routing";

import {ImageZoomModule} from 'angular2-image-zoom';

import { AuthService, AlertService, RestService } from "services";
import { HomeComponent } from "./home/home.component";
import { MenuComponent } from "./menu/menu.component";
import { FullLayoutComponent } from "./layouts/full-layout.component";
import { RecipeComponent } from "./recipe/recipe.component";
import { SwagsComponent } from './swags/swags.component';
import { SwagViewComponent } from './swags/swag.view.component';
import { TabsModule, AccordionModule, ModalModule, TooltipModule, CarouselModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaqComponent } from './faq/faq.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';
import { TopmenuComponent } from './blocks/topmenu.component';
import { ContactComponent } from './contact/contact.component';
import { CheckoutSuccessComponent } from './cart/checkout-success.component';
import { SuccessComponent } from './success.component';
import { MessageLayoutComponent } from './layouts/message-layout.component';
import { NotFoundComponent } from './layouts/404-layout.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    SharedModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    HttpModule,
    FrontRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ImageZoomModule
  ],
  declarations: [
    FrontComponent,
    FullLayoutComponent,
    MessageLayoutComponent,
    HomeComponent,
    MenuComponent,
    RecipeComponent,
    SwagsComponent,
    SwagViewComponent,
    FaqComponent,
    ContactComponent,
    SimpleLayoutComponent,
    TopmenuComponent,
    CheckoutSuccessComponent,
    SuccessComponent,
    NotFoundComponent
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }, DatePipe
  ],
  bootstrap: [ FrontComponent ]
})
export class FrontModule { }

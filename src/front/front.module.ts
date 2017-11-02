import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, CommonModule, DatePipe, PathLocationStrategy } from '@angular/common';
import { FrontComponent } from "front/front.component";
import { HttpModule } from "@angular/http";
import { SharedModule } from "shared.module";
import { FrontRoutingModule } from "front/front.routing";

import { AuthService, AlertService, RestService } from "services";
import { HomeComponent } from "front/home/home.component";
import { MenuComponent } from "front/menu/menu.component";
import { FullLayoutComponent } from "front/layouts/full-layout.component";
import { RecipeComponent } from "front/recipe/recipe.component";
import { SwagsComponent } from 'front/swags/swags.component';
import { SwagViewComponent } from 'front/swags/swag.view.component';
import { TabsModule, AccordionModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaqComponent } from 'front/faq/faq.component';
import { SimpleLayoutComponent } from 'front/layouts/simple-layout.component';
import { TopmenuComponent } from 'front/blocks/topmenu.component';
import { ContactComponent } from 'front/contact/contact.component';

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
    HttpModule,
    FrontRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    FrontComponent,
    FullLayoutComponent,
    HomeComponent,
    MenuComponent,
    RecipeComponent,
    SwagsComponent,
    SwagViewComponent,
    FaqComponent,
    ContactComponent,
    SimpleLayoutComponent,
    TopmenuComponent
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }, DatePipe
  ],
  bootstrap: [ FrontComponent ]
})
export class FrontModule { }

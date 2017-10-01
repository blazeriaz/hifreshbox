import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, CommonModule, DatePipe } from '@angular/common';
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
import { TabsModule, AccordionModule } from 'ngx-bootstrap';
import { NewsletterComponent } from 'front/blocks/newsletter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaqComponent } from 'front/faq/faq.component';
import { SimpleLayoutComponent } from 'front/layouts/simple-layout.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    SharedModule.forRoot(),  
    TabsModule.forRoot(),  
    AccordionModule.forRoot(),
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
    NewsletterComponent,
    FaqComponent,

    SimpleLayoutComponent
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

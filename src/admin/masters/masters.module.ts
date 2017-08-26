import { NgModule }                 from '@angular/core';
import { CommonModule } from "@angular/common";

import { MasterRoutingModule }   from './masters-routing.module';
import { RestService, PagerService } from "services";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ingredientListResolve, IngredientsListComponent } from "./ingredients";
import { portionListResolve, PortionsListComponent } from "./portions";

import  { SharedModule } from "shared.module";


@NgModule({
    imports: [
        MasterRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, SharedModule 
    ],
    declarations: [ IngredientsListComponent, PortionsListComponent ],
    providers: [RestService, PagerService, ingredientListResolve, portionListResolve]
})
export class MastersModule { }

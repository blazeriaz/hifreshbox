import { NgModule }                 from '@angular/core';
import { CommonModule } from "@angular/common";

import { MasterRoutingModule }   from './masters-routing.module';
import { RestService, PagerService } from "services";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { emptyLayoutComponent } from "../layouts/empty-layout.component";

import { ingredientListResolve, IngredientsListComponent } from "./ingredients";
import { portionListResolve, PortionsListComponent } from "./portions";

@NgModule({
    imports: [
        MasterRoutingModule, CommonModule, FormsModule, ReactiveFormsModule
    ],
    declarations: [ IngredientsListComponent, PortionsListComponent, emptyLayoutComponent ],
    providers: [RestService, PagerService, ingredientListResolve, portionListResolve]
})
export class MastersModule { }

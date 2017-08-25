import { NgModule }                 from '@angular/core';
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from 'shared.module';

import { MenuComponent } from './menu.component';
import { MenuRoutingModule }   from './menu.routing';
import { RecipesListComponent } from "./recipes.component";
import { MenuListComponent } from "./list.component";
import { PagerService, MealMenuService } from "services";

import {SelectModule} from 'ng2-select';

@NgModule({
    imports: [
        SelectModule, MenuRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, SharedModule
    ],
    declarations: [MenuComponent, RecipesListComponent, MenuListComponent],
    providers: [DatePipe, PagerService, MealMenuService]
})
export class MenuModule { }
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'shared.module';

import { MenuComponent } from './menu.component';
import { MealRoutingModule } from './meal.routing';
import { RecipesListComponent } from './recipes.component';
import { MenuListComponent } from './list.component';
import { PagerService, MealMenuService } from 'services';

import {SelectModule} from 'ng2-select';
import { MealComponent } from './meal.component';

@NgModule({
    imports: [
        SelectModule, MealRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, SharedModule
    ],
    declarations: [MealComponent, MenuComponent, RecipesListComponent, MenuListComponent],
    providers: [DatePipe, PagerService, MealMenuService]
})
export class MealModule {

}

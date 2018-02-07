import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'shared.module';
import { DndModule } from 'ng2-dnd';

import { MenuComponent } from './menu.component';
import { MealRoutingModule } from './meal.routing';
import { RecipesListComponent } from './recipes.component';
import { MenuListComponent } from './list.component';
import { PagerService, MealMenuService } from 'services';

import {SelectModule} from 'ng2-select';
import { MealComponent } from './meal.component';
import { SubscriptionListComponent } from './subscriptions.component';

@NgModule({
    imports: [
        SelectModule, MealRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, SharedModule, DndModule
    ],
    declarations: [MealComponent, MenuComponent, RecipesListComponent, MenuListComponent, SubscriptionListComponent],
    providers: [DatePipe, PagerService, MealMenuService]
})
export class MealModule {

}

import { NgModule }                 from '@angular/core';
import { CommonModule } from "@angular/common";

import { UsersListComponent } from './list.component';
import { UsersRoutingModule }   from './users-routing.module';
import { UsersService, PagerService } from "services";
import { UserFormComponent } from "./form.component";
import { MealComponent } from "./meal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {SelectModule} from 'ng2-select';
import { SharedModule } from 'shared.module';

@NgModule({
    imports: [
        SharedModule, SelectModule, UsersRoutingModule, CommonModule, FormsModule, ReactiveFormsModule
    ],
    declarations: [ UsersListComponent, UserFormComponent, MealComponent ],
    providers: [UsersService, PagerService]
})
export class UsersModule { }

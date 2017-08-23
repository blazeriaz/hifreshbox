import { NgModule }                 from '@angular/core';
import { CommonModule } from "@angular/common";

import { UsersListComponent, customerListResolve } from './list.component';
import { UsersRoutingModule }   from './users-routing.module';
import { UsersService, PagerService } from "services";
import { UserFormComponent, customerEditResolve } from "./form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {SelectModule} from 'ng2-select';

@NgModule({
    imports: [
        SelectModule, UsersRoutingModule, CommonModule, FormsModule, ReactiveFormsModule
    ],
    declarations: [ UsersListComponent, UserFormComponent ],
    providers: [UsersService, customerEditResolve, customerListResolve, PagerService]
})
export class UsersModule { }

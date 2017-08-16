import { NgModule }                 from '@angular/core';
import { CommonModule } from "@angular/common";

import { UsersListComponent, customerListResolve } from './list.component';
import { UsersRoutingModule }   from './users-routing.module';
import { UsersService } from "services";
import { UserFormComponent, customerEditResolve } from "./form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { emptyLayoutComponent } from "../layouts/empty-layout.component";
import {SelectModule} from 'ng2-select';

@NgModule({
    imports: [
        SelectModule, UsersRoutingModule, CommonModule, FormsModule, ReactiveFormsModule
    ],
    declarations: [ UsersListComponent, UserFormComponent, emptyLayoutComponent ],
    providers: [UsersService, customerEditResolve, customerListResolve]
})
export class UsersModule { }

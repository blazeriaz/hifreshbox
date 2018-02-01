import { NgModule }                 from '@angular/core';
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MenuRoutingModule } from './settings.routing';
import { SharedModule } from 'shared.module';

import { PofileFormComponent, profileEditResolve } from './profile.component';
import { EmailsFormComponent, emailsFormResolve } from './emails.component';
import { StoreFormComponent, storeFormResolve } from './store_info.component';
import { OthersFormComponent, missEditResolve } from './others.component';
import { PagerService, UsersService } from "services";

import {SelectModule} from 'ng2-select';

@NgModule({
    imports: [
        MenuRoutingModule, SelectModule, CommonModule, FormsModule, ReactiveFormsModule, SharedModule
    ],
    declarations: [PofileFormComponent, EmailsFormComponent, StoreFormComponent, OthersFormComponent],
    providers: [DatePipe, PagerService, UsersService, profileEditResolve, emailsFormResolve, storeFormResolve, missEditResolve]
})
export class SettingsModule { } 
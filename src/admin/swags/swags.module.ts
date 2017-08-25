import { NgModule }                 from '@angular/core';

import { SwagsListComponent, swagsListResolve } from './list.component';
import { SwagsRoutingModule }   from './swags-routing.module';
import { ProductsService } from "services";
import { CommonModule } from "@angular/common";
import { SwagFormComponent, swagEditResolve } from "./form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {SelectModule} from 'ng2-select';
import { PagerService } from 'services/index'

import {SharedModule} from "shared.module";

@NgModule({
    imports: [
        SelectModule, SwagsRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, SharedModule
    ],
    declarations: [ SwagsListComponent, SwagFormComponent ],
    providers: [ProductsService, swagsListResolve, swagEditResolve, PagerService]
})
export class SwagsModule { }

import { NgModule }                 from '@angular/core';

import { RecipesListComponent } from './list.component';
import { RecipesRoutingModule }   from './recipes-routing.module';
import { ProductsService } from "services";
import { CommonModule } from "@angular/common";
import {SelectModule} from 'ng2-select';
import { PagerService } from 'services/index'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {SharedModule} from "shared.module";
import { TabsModule, TooltipModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        SelectModule, RecipesRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, 
        SharedModule, TabsModule, TooltipModule
    ],
    declarations: [ RecipesListComponent ],
    providers: [ProductsService, PagerService]
})
export class RecipesModule { }

import { NgModule }                 from '@angular/core';

import { CookbooksComponent } from './cookbooks.component';
import { CookbooksRoutingModule }   from './cookbooks-routing.module';
import { ProductsService } from "services";
import { CommonModule } from "@angular/common";
import {SelectModule} from 'ng2-select';
import { PagerService } from 'services/index'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {SharedModule} from "shared.module";
import { TabsModule, TooltipModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        SelectModule, CookbooksRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, 
        SharedModule, TabsModule, TooltipModule
    ],
    declarations: [ CookbooksComponent ],
    providers: [ProductsService, PagerService]
})
export class CookbooksModule { }

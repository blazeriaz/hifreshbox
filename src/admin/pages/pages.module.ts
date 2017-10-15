import { NgModule }                 from '@angular/core';
import { CommonModule } from "@angular/common";

import { PagesListComponent } from './list.component';
import { PagesRoutingModule }   from './pages-routing.module';
import { PagerService } from "services";
import { PageViewComponent } from "./view.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {SelectModule} from 'ng2-select';

@NgModule({
    imports: [
        SelectModule, PagesRoutingModule, CommonModule, FormsModule, ReactiveFormsModule
    ],
    declarations: [ PagesListComponent, PageViewComponent ],
    providers: [ PagerService]
})
export class PagesModule { }

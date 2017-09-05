import { NgModule }                 from '@angular/core';

import { ReviewsListComponent } from './list.component';
import { ReviewsRoutingModule }   from './reviews-routing.module';
import { ProductsService } from "services";
import { CommonModule } from "@angular/common";
import { ReviewFormComponent, reviewEditResolve } from "./form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {SelectModule} from 'ng2-select';
import { PagerService } from 'services/index'

import {SharedModule} from "shared.module";
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import * as Dropzone from 'dropzone';
Dropzone.autoDiscover = false;
const DROPZONE_CONFIG: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url : "#",
    maxFilesize: 1,
    uploadMultiple: false,
    autoProcessQueue: false
}; 

@NgModule({
    imports: [
        SelectModule, ReviewsRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, 
        SharedModule, DropzoneModule.forRoot(DROPZONE_CONFIG)
    ],
    declarations: [ ReviewsListComponent, ReviewFormComponent ],
    providers: [ProductsService, reviewEditResolve, PagerService]
})
export class ReviewsModule { }

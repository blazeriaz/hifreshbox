import { NgModule }                 from '@angular/core';

import { NewslettersListComponent } from './list.component';
import { NewslettersRoutingModule }   from './newsletter-routing.module';
import { ProductsService } from "services";
import { CommonModule } from "@angular/common";
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
        SelectModule, NewslettersRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, 
        SharedModule, DropzoneModule.forRoot(DROPZONE_CONFIG)
    ],
    declarations: [ NewslettersListComponent ],
    providers: [ProductsService, PagerService]
})
export class NewsletterModule { }

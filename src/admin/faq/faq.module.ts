import { NgModule }                 from '@angular/core';

import { FaqListComponent } from './list.component';
import { FaqRoutingModule }   from './faq-routing.module';
import { CommonModule } from "@angular/common";
import { FaqFormComponent } from "./form.component";
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
        SelectModule, FaqRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, 
        SharedModule, DropzoneModule.forRoot(DROPZONE_CONFIG)
    ],
    declarations: [ FaqListComponent,FaqFormComponent ],
    providers: [PagerService]
})
export class FaqModule { }

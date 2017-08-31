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
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import * as Dropzone from 'dropzone';
Dropzone.autoDiscover = false;
const DROPZONE_CONFIG: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    maxFilesize: 1,
    uploadMultiple: false,
    autoProcessQueue: false
  };

@NgModule({
    imports: [
        SelectModule, SwagsRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, 
        SharedModule, DropzoneModule.forRoot(DROPZONE_CONFIG)
    ],
    declarations: [ SwagsListComponent, SwagFormComponent ],
    providers: [ProductsService, swagsListResolve, swagEditResolve, PagerService]
})
export class SwagsModule { }

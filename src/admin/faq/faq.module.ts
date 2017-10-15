import { NgModule } from '@angular/core';

import { FaqsListComponent } from './list.component';
import { FaqRoutingModule } from './faq-routing.module';
import { CommonModule } from '@angular/common';
import { FaqFormComponent } from './form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectModule} from 'ng2-select';
import { PagerService } from 'services/index'

import {SharedModule} from 'shared.module';

@NgModule({
    imports: [
        SelectModule, FaqRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, SharedModule
    ],
    declarations: [ FaqsListComponent, FaqFormComponent ],
    providers: [PagerService]
})
export class FaqModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectModule} from 'ng2-select';
import { SharedModule } from 'shared.module';

import { GiftRoutingModule } from './gift-routing.module';
import { PagerService } from 'services';
import { TabsModule, TooltipModule } from 'ngx-bootstrap';

import { PageComponent } from './page.component';
import { ProductComponent } from './product.component';

@NgModule({
  imports: [
    SharedModule,
    SelectModule,
    GiftRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    TooltipModule
  ],
  declarations: [
    PageComponent,
    ProductComponent
  ],
  providers: [PagerService]
})
export class GiftModule { }

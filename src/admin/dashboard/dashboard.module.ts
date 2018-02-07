import { NgModule }                 from '@angular/core';
import { ChartsModule }             from 'ng2-charts/ng2-charts';
import { CommonModule } from "@angular/common";

import { DashboardComponent }       from './dashboard.component';
import { DashboardRoutingModule }   from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        DashboardRoutingModule,
        ChartsModule,
        CommonModule, FormsModule, ReactiveFormsModule
    ],
    declarations: [ DashboardComponent ]
})
export class DashboardModule { }

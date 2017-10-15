import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { PagesListComponent } from './list.component';
import { PageViewComponent } from "./view.component";
import { FullLayoutComponent } from "../layouts/full-layout.component";
import { emptyLayoutComponent } from "../layouts/empty-layout.component";

const routes: Routes = [
    {
        path: '',
        component: PagesListComponent,
        data: {
            title: 'Pages'
        }
    },
    {
        path: 'view/:id',
        component: PageViewComponent,
        data: {
            title: 'View Page'
        }
    }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}

import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { CookbooksComponent } from './cookbooks.component';

const routes: Routes = [
    {
        path: '',
        component: CookbooksComponent,
        data: {
            title: 'Cookbooks'
        }
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CookbooksRoutingModule {}

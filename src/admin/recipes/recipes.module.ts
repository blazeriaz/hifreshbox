import { NgModule }                 from '@angular/core';

import { RecipesListComponent }       from './list.component';
import { RecipesRoutingModule }   from './recipes-routing.module';

@NgModule({
    imports: [
        RecipesRoutingModule
    ],
    declarations: [ RecipesListComponent ]
})
export class RecipesModule { }

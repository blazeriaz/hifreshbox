import { NgModule }                 from '@angular/core';

import { UsersListComponent }       from './list.component';
import { UsersRoutingModule }   from './users-routing.module';

@NgModule({
    imports: [
        UsersRoutingModule
    ],
    declarations: [ UsersListComponent ]
})
export class UsersModule { }

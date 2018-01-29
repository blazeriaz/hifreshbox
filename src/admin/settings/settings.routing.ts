import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { PofileFormComponent, profileEditResolve } from './profile.component';
import { EmailsFormComponent, emailsFormResolve } from './emails.component';
import { StoreFormComponent, storeFormResolve } from './store_info.component';
import { emptyLayoutComponent } from '../layouts/empty-layout.component';
import { OthersFormComponent } from './others.component';


const routes: Routes = [
    {
        path: '',
        component: emptyLayoutComponent,
        data: {
            title: 'Settings'
        },
        children: [{
            path: 'profile',
            component: PofileFormComponent,
            resolve: {
                profile: profileEditResolve
            },
            data: {
                title: 'Profile'
            }
        },{
            path: 'emails',
            component: EmailsFormComponent,
            resolve: {
                emails: emailsFormResolve
            },
            data: {
                title: 'Contact Emails'
            }
        },{
            path: 'store',
            component: StoreFormComponent,
            resolve: {
                store: storeFormResolve
            },
            data: {
                title: 'Store Details'
            }
        },{
            path: 'others',
            component: OthersFormComponent,
            data: {
                title: 'Others Details'
            }
        }]
    }
    
];
 
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MenuRoutingModule {}

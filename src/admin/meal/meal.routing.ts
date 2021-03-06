import { NgModule } from '@angular/core';
import { Routes,
         RouterModule } from '@angular/router';

import { MenuComponent } from './menu.component';
import { MenuListComponent } from './list.component';
import { RecipesListComponent } from './recipes.component';
import { MealComponent } from './meal.component';
import { SubscriptionListComponent } from './subscriptions.component';
import { AuthService } from 'services';

const routes: Routes = [{
    path: 'edit/:sku',
    component: MealComponent
}, {
    path: 'menu',
    component: MenuComponent,
    data: {
        title: 'Menu'
    },
    children: [{
        path: '',
        component: MenuListComponent,
    },{
        path: 'subscriptions',
        component: SubscriptionListComponent,
    }, {
        path: 'add-recipe',
        component: RecipesListComponent
    }]
}, {
  path: 'recipes',
  canActivate: [AuthService],
  loadChildren: './recipes/recipes.module#RecipesModule'
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MealRoutingModule {}

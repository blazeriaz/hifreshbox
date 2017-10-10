import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import { FrontComponent } from 'front/front.component';
import { HomeComponent } from 'front/home/home.component';
import { MenuComponent } from 'front/menu/menu.component';
import { FullLayoutComponent } from 'front/layouts/full-layout.component';
import { RecipeComponent } from 'front/recipe/recipe.component';
import { SwagsComponent } from 'front/swags/swags.component';
import { SwagViewComponent } from 'front/swags/swag.view.component';
import { FaqComponent } from 'front/faq/faq.component';
import { SimpleLayoutComponent } from 'front/layouts/simple-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: FrontComponent,
    data: {
      title: 'Home'
    },
    children : [{
      path: '',
      component: FullLayoutComponent,
      data: {
        title: 'Home'
      },
      children : [{
        path: '',
        component: HomeComponent,
        data: {
          title: 'Home'
        }
      },{
        path: 'menu',
        component: MenuComponent,
        data: {
          title: 'Menu'
        }
      },{
        path: 'menu/:sku',
        component: RecipeComponent,
        data: {
          title: 'Menu Recipe'
        }
      },{
        path: 'swags',
        component: SwagsComponent,
        data: {
          title: 'Swags'
        }
      },{
        path: 'swags/:sku',
        component: SwagViewComponent,
        data: {
          title: 'Swags'
        }
      },{
        path: 'faq',
        component: FaqComponent,
        data: {
          title: 'FAQ'
        }
      }]
    }, {
      path: 'account',
      component: FullLayoutComponent,
      children : [{
        path: '',
        loadChildren: './account/account.module#AccountModule',
      }]
    }, {
      path: 'auth',
      component: SimpleLayoutComponent,
      children : [{
        path: '',
        loadChildren: './auth/auth.module#AuthModule',
      }]
    }]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class FrontRoutingModule {}
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import { FrontComponent } from './front.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { FullLayoutComponent } from './layouts/full-layout.component';
import { RecipeComponent } from './recipe/recipe.component';
import { SwagsComponent } from './swags/swags.component';
import { SwagViewComponent } from './swags/swag.view.component';
import { FaqComponent } from './faq/faq.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';
import { ContactComponent } from './contact/contact.component';
import { CheckoutSuccessComponent } from './cart/checkout-success.component';
import { SuccessComponent } from './success.component';

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
      }, {
        path: 'menu',
        component: MenuComponent,
        data: {
          title: 'Menu'
        }
      }, {
        path: 'menu/:sku',
        component: RecipeComponent,
        data: {
          title: 'Menu Recipe'
        }
      }, {
        path: 'swags',
        component: SwagsComponent,
        data: {
          title: 'Swags'
        }
      }, {
        path: 'swags/:sku',
        component: SwagViewComponent,
        data: {
          title: 'Swags'
        }
      }, {
        path: 'faq',
        component: FaqComponent,
        data: {
          title: 'FAQ'
        }
      }, {
        path: 'contact',
        component: ContactComponent,
        data: {
          title: 'Contact'
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
      path: 'gift',
      component: FullLayoutComponent,
      children : [{
        path: '',
        loadChildren: './gift/gift.module#GiftModule',
      }]
    }, {
      path: 'cart',
      component: FullLayoutComponent,
      children : [{
        path: '',
        loadChildren: './cart/cart.module#CartModule',
      }]
    }, {
      path: 'checkout-success',
      component: SimpleLayoutComponent,
      children : [{
        path: '',
        component: CheckoutSuccessComponent,
      }]
    }, {
      path: 'success',
      component: SimpleLayoutComponent,
      children : [{
        path: '',
        component: SuccessComponent,
      }]
    }, {
      path: 'auth',
      component: SimpleLayoutComponent,
      children : [{
        path: '',
        loadChildren: './auth/auth.module#AuthModule',
      }]
    }, {
      path: 'cookbook',
      component: FullLayoutComponent,
      children : [{
        path: '',
        loadChildren: './recipes/recipes.module#RecipesModule',
      }]
    }]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: false }) ],
  exports: [ RouterModule ]
})
export class FrontRoutingModule {}

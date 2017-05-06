/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {
  NgaThemeModule,
  NgaSidebarModule,
  NgaCardModule,
  NgaLayoutModule,
  NgaMenuModule,
  NgaBootstrapModule
} from '../../src/framework/theme';
import { NgdAppComponent } from './app.component';
import { routes } from './app.routes';
import { menus } from './app.menu';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes, { useHash: true }),
    NgaThemeModule.forRoot({ name: 'default' }),
    NgaCardModule,
    NgaLayoutModule,
    NgaMenuModule.forRoot({ items: menus }),
    NgaSidebarModule.forRoot(),
    NgaBootstrapModule.forRoot(),
  ],
  declarations: [
    NgdAppComponent,
  ],
  entryComponents: [
  ],
  providers: [],
  bootstrap: [NgdAppComponent],
})
export class AppModule {
}

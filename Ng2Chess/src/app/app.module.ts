import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { rootRouterConfig } from "./app.routes";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { HomeComponent } from './home/home';
import { GameComponent } from './game/game';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponents } from './components';
import { AppServices } from './services';

@NgModule({
  declarations: [AppComponent, HomeComponent, GameComponent, ...AppComponents],
  imports     : [BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(rootRouterConfig)],
  providers   : [...AppServices, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap   : [AppComponent]
})
export class AppModule {

}

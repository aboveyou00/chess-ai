import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { GameComponent } from './game/game';

export const rootRouterConfig: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'game', children: [
    {path: ':gameName', component: GameComponent}
  ]}
];

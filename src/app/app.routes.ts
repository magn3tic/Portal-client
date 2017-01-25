import { Routes } from '@angular/router';
import { Home, ClientDetails, PageNotFound, TokenDisplay } from './ui';
import { Main, Auth, UserProfile, ScopeDisplay, ClientsDisplay, DealsDisplay } from './containers';
import { AuthService, IsSuper, ClientsService } from './services';

export const rootRouterConfig: Routes = [
  {
    path: '',
    component: Main,
    canActivate: [AuthService],
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'scope',
        component: ScopeDisplay
      },
      {
        path: 'profile',
        component: UserProfile
      },
      {
        path: 'clients',
        component: ClientsDisplay,
        // canActivate: [ClientsService]
      },
      {
        path: 'deals',
        component: DealsDisplay,
        // canActivate: [ClientsService]
      },
      {
        path: 'clients/:client',
        component: ClientDetails
      }
    ]
  },
  { path: 'token', component: TokenDisplay},
  { path: 'auth', component: Auth},
  { path: '**', component: Auth }
];


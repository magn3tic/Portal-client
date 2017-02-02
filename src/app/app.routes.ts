import { Routes } from '@angular/router';
import { Home, CompanyDetails, PageNotFound, TokenDisplay } from './ui';
import { Main, Auth, UserProfile, ScopeDisplay, ClientsDisplay, DealsDisplay, CompaniesDisplay } from './containers';
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
        path: 'company',
        component: CompanyDetails
      },
      {
        path: 'companies',
        component: CompaniesDisplay
      }
    ]
  },
  { path: 'token', component: TokenDisplay },
  { path: 'auth', component: Auth },
  { path: '**', redirectTo: 'auth' },
];


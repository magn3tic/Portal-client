import { Routes } from '@angular/router';
import { Home, ClientDetails } from './ui';
import { Main, Auth, CreateUserForm, Admin, UserProfile, ScopeDisplay, ClientsDisplay } from './containers';
import { AuthService, IsSuper, ClientsService } from './services';

export const rootRouterConfig: Routes = [
  {
    path: '',
    component: Main,
    // canActivate: [AuthService],
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'admin',
        component: Admin,
        canActivate: [IsSuper]
      },
      {
        path: 'scope',
        component: ScopeDisplay
      },
      {
        path: 'scope/:companyId',
        component: ScopeDisplay
      },
      {
        path: 'profile',
        component: UserProfile
      },
      {
        path: 'clients',
        component: ClientsDisplay,
        canActivate: [ClientsService]
      },
      {
        path: 'clients/:companyId',
        component: ClientDetails
      }
    ]
  },
  { path: 'auth', component: Auth },
  { path: '*code*', redirectTo: 'home' }
];


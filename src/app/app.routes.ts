import { Routes } from '@angular/router';
import { Home, ClientDetails } from './ui';
import { Main, Auth, CreateUserForm, Admin, UserProfile, ScopeDisplay, ClientsDisplay } from './containers';
import { AuthService, IsSuper } from './services';

export const rootRouterConfig: Routes = [
  {
    path: '',
    component: Main,
    canActivate: [AuthService],
    children: [
      {
        path: '',
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
        path: 'scope/:client._id',
        component: ScopeDisplay
      },
      {
        path: 'profile',
        component: UserProfile
      },
      {
        path: 'clients',
        component: ClientsDisplay
      },
      {
        path: 'clients/:_id',
        component: ClientDetails
      }
    ]
  },
  { path: 'auth', component: Auth },
  { path: '**', redirectTo: '' }
];


import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { RolesComponent } from './components/roles/roles.component';
import { GeneralSettingsComponent } from './components/settings/general-settings.component';
import { SecuritySettingsComponent } from './components/settings/security-settings.component';
import { NotificationsSettingsComponent } from './components/settings/notifications-settings.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'users', component: UsersComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'settings/general', component: GeneralSettingsComponent },
      { path: 'settings/security', component: SecuritySettingsComponent },
      { path: 'settings/notifications', component: NotificationsSettingsComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];

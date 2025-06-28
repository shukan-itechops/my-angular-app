import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { ProductComponent } from './components/product/product.component';
import { authGuard } from './guards/auth.guard';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';
import { UserList } from './components/user-list/user-list';
import { Settings } from './components/settings/settings';
import { Report } from './components/report/report';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'ingredient-list',
    component: EmployeeListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'create-employee',
    component: EmployeeFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'employee/:id',
    component: EmployeeFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'app-product',
    component: ProductComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },
  {
    path: 'user-list',
    component: UserList,
    canActivate: [authGuard]
  },
    {
    path: 'settings',
    component: Settings,
    canActivate: [authGuard]
  },
    {
    path: 'report',
    component: Report,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { ProductComponent } from './components/product/product.component';

export const routes: Routes = [
  {
    path:"",
    component: EmployeeListComponent
  },
  {
    path:"employee-list",
    component:EmployeeListComponent
  },
  {
    path:"create-employee",
    component: EmployeeFormComponent
  },
  {
    path:"employee/:id",
    component: EmployeeFormComponent
  },
  {
    path: "app-product",
    component: ProductComponent
  }
];

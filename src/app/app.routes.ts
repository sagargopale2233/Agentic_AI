import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { EmployeeDataComponent } from './employee-data/employee-data.component';
import { SubmitComponent } from './submit/submit.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'create-employee', component: CreateEmployeeComponent },
  { path: 'employee-data', component: EmployeeDataComponent },
  { path: 'submit', component: SubmitComponent },
];

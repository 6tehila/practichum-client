import { Routes } from '@angular/router';
import { AddEmployeeComponent } from './employee/components/add-employee/add-employee.component';
import { AllEmployeesComponent } from './employee/components/all-employees/all-employees.component';
import { EditEmployeeComponent } from './employee/components/edit-employee/edit-employee.component';



export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule) },
    { path: 'edit-employee/:id', component: EditEmployeeComponent },
    { path: 'add-employee', component: AddEmployeeComponent },
    { path: 'all-employees', component: AllEmployeesComponent }

];
import { NgModule } from '@angular/core';
import { AllEmployeesComponent } from './components/all-employees/all-employees.component';
import { RouterModule, Routes } from '@angular/router';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';


const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: AllEmployeesComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }
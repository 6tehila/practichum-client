import { NgModule } from '@angular/core';
import { AllEmployeesComponent } from './components/all-employees/all-employees.component';
import { CommonModule } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.modul';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { RoleServiceService } from '../services/role-service.service';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [AllEmployeesComponent],
  imports: [CommonModule,EmployeeRoutingModule,MatListModule, MatDividerModule, MatTableModule,
    MatPaginatorModule,MatButtonModule, MatTooltipModule, FormsModule,
    ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatDialogModule,MatIconModule
  ] ,
  providers: [RoleServiceService],
})
export class EmployeeModule { }
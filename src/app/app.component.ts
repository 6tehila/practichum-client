import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllEmployeesComponent } from './employee/components/all-employees/all-employees.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'EmployeeManagement';
}
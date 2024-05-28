import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../entities/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css']
})
export class AllEmployeesComponent implements OnInit {

  searchResults$: Observable<Employee[]>;
  private searchTerms = new Subject<string>();

  employeesList: MatTableDataSource<Employee>; 
  displayedColumns: string[] = [ 'id', 'firstName', 'lastName','startDate', 'editIcon', 'deleteIcon'];

  constructor(private employeeService: EmployeeService,private router: Router) {} 

  ngOnInit(): void {
    this.refreshEmployeeList();
    // this.searchTerms.next('');
  }

  refreshEmployeeList(): void {
    this.employeeService.getEmployeeList().subscribe({
      next: (res) => {
         const activeEmployees = res.filter(employee => employee.isActive);
        // this.employeesList = new MatTableDataSource<Employee>(res); //all employees
        this.employeesList = new MatTableDataSource<Employee>(activeEmployees);

        console.log("res",res);
        console.log("active employees", activeEmployees);
      },
      error: (err) => {
        console.log(err, "error");
      }
    });
  }

  deleteEmployee(employee: Employee): void {
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        const index = this.employeesList.data.findIndex(emp => emp.id === employee.id);
        if (index !== -1) {
          this.employeesList.data.splice(index, 1);
          this.employeesList._updateChangeSubscription();
        }
      },
      error: (err) => {
        console.log(err, "error");
      }
    });
  } 
  editEmployee(employee: Employee): void{
    console.log(employee);
    this.router.navigate(['/edit-employee', employee.id]);
  } 
  

  downloadEmployeesList(): void {
    this.employeeService.getEmployeeList().subscribe({
      next: (res) => {
        const data: any[] = [
          ['ID', 'First Name', 'Last Name', 'Start Date', 'Birth Date', 'Gender', 'Active'],
        ];    
        console.log("res",res) ;
        res.forEach(employee => {
          const genderText = getGenderText(employee.gender);
          const isActiveText = employee.isActive ? 'Active' : 'Inactive';
          const startDate = new Date(employee.startDate).toLocaleDateString();
          const birthDate = new Date(employee.birthDate).toLocaleDateString();
          
          const employeeData = [
            employee.id,
            employee.firstName,
            employee.lastName,
            startDate,
            birthDate,
            genderText,
            isActiveText,
          ];
          data.push(employeeData);
        });

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Employees');

        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        const fileName = 'employees_list.xlsx';
        saveAs(blob, fileName);
      },
      error: (err) => {
        console.log(err, "error");
      }     
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.employeesList.filter = filterValue.trim().toLowerCase();
  }

}
function getGenderText(gender: Gender | number): string {
  if (gender === Gender.Female || gender === 1) {
    return 'Female';
  } else if (gender === Gender.Male || gender === 0) {
    return 'Male';
  } else {
    return 'Unknown';
  }
}

enum Gender {
  Male = 'male',
  Female = 'female'
}

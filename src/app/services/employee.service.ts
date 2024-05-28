import { HttpClient } from '@angular/common/http';
import { Employee } from '../entities/employee.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeeList: Employee[] = null;
  
  constructor(private http: HttpClient) { }
  getEmployeeList(): Observable<Employee[]> {
    return this.http.get<Employee[]>('https://localhost:7002/api/Employee')}

  getEmployeeById(id:number): Observable<Employee> {
    return this.http.get<Employee>(`https://localhost:7002/api/Employee/${id}`)}

    addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>('https://localhost:7002/api/Employee', employee);
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`https://localhost:7002/api/Employee/${id}`, employee);
  }
  
  deleteEmployee(id: number): Observable<Employee> {
    return this.http.delete<Employee>(`https://localhost:7002/api/Employee/${id}`);
  }

}

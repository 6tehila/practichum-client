import { Employee, Role } from "./employee.model";

export class EmployeeRole {
    employeeId: number;
    employee: Employee;
    roleId: number;
    role: Role;
    entryDate: Date;
    IsManagerial:boolean;
}
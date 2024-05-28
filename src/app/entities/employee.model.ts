
import { EmployeeRole } from "./employeeRole.model"
import { Role } from "./role.model"

export class Employee {
    id:number
    firstName:string
    lastName:string
    startDate: Date
    birthDate:Date
     isActive:boolean
     gender:Gender
    roles:EmployeeRole[]
   
    
}
export enum Gender {
    Male = 'male',
    Female = 'female'
}
export {Role}
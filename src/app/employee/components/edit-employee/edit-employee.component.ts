import { Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialog, } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, FormArray, FormsModule, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgModule } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Employee, Gender } from '../../../entities/employee.model';
import { EmployeeRole } from '../../../entities/employeeRole.model';
import { EmployeeService } from '../../../services/employee.service';
import { RoleServiceService } from '../../../services/role-service.service';
import { Role } from '../../../entities/role.model';

export interface DialogData2 {
  errors: string[]
}
@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogTitle, MatDialogContent,
    MatDialogActions, MatDialogClose, MatExpansionModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatRadioModule, ReactiveFormsModule,
    CommonModule, MatCardModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit {
  public employeeForm!: FormGroup;
  public employee: Employee = new Employee();
  public employeeId: number = 0;
  validationErrors: string[] = [];
  employeeRolePostModel: EmployeeRole = new EmployeeRole(); // Declare employeeRolePostModel property
  employeeRoles: { roleName: string, isManagementRole: string, entryDate: Date | null }[] = []; // Declare employeeRoles property
  employeeRoleResult: EmployeeRole[] = [];
  rolesList!: Role[];
  filteredRolesList: Role[] = [];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
    private _roleServices: RoleServiceService
  ) { }

  ngOnInit(): void {
    this.employeeId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.initForm();
    if (this.employeeId !== 0) {
      this.getEmployeeDetails(this.employeeId);
    }
    this._roleServices.getRolesList().subscribe({
      next: (res) => {
        console.log("this is the res", res);
        this.rolesList = res.map((role: Role) => ({ ...role, selected: false }));
      },
      error: (erro) => {
        console.log(erro)
      }
    })
    this.employeeId = +this.route.snapshot.paramMap.get('id');
    // Fetch the employee details using the ID
    this.employeeService.getEmployeeById(this.employeeId).subscribe(employee => {
      this.employee = employee;
    });
    this.displayEmployeeRoles(this.employeeRoles);

  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      identity: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(9)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      isActive: [''],
      maleOrFmale: ['', Validators.required],
      birthDate: [null, Validators.required],
      startDate: [null, Validators.required],
      employeeRoles: this.fb.array([], this.roleNameNotDuplicateValidator)
    });
  }

  getEmployeeDetails(employeeId: number): void {
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (employee: Employee) => {
        this.employee = employee;
        this.patchFormValues();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  patchFormValues(): void {
    this.employeeForm.patchValue({
      identity: this.employee.id,
      firstName: this.employee.firstName,
      lastName: this.employee.lastName,
      isActive:true,
      birthDate: this.employee.birthDate,
      startDate: this.employee.startDate,
      maleOrFmale: this.employee.gender === Gender.Male ? '1' : '0'

    });

    if (this.employee.roles) {
      this.employee.roles.forEach(role => {

        this.addRole(role.employee.firstName, role.IsManagerial ? '1' : '0', role.entryDate);
      });
    }
  }


  addRole(roleName: string, isManagementRole: string, entryDate: Date | null): void {
    const roleFormGroup = this.fb.group({
      roleName: [roleName, [Validators.required, this.roleNameValidator(this.employeeRolesFormArray.length)]],
      isManagementRole: [isManagementRole, Validators.required],
      entryDate: [entryDate, [Validators.required, this.startDateBeforeEntryDateValidator.bind(this)]]
    });

    this.employeeRolesFormArray.push(roleFormGroup);

    // Find the index of the role in the rolesList array
    const roleIndex = this.rolesList.findIndex(role => role.name === roleName);
    if (roleIndex !== -1) {
      // Update the selected property of the role
      this.rolesList[roleIndex].selected = true;
    }
    this.updateFilteredRolesList(); // Update the list of available roles for editing
  }

  removeRole(index: number) {

    this.employeeRolesFormArray.removeAt(index);
    this.updateRolesList();
    this.updateFilteredRolesList(); // Call updateFilteredRolesList after removing a role
  }


  updateRolesList() {
    this._roleServices.getRolesList().subscribe({
      next: (res) => {
        this.rolesList = res;
      },
      error: (err) => {
        console.log(err)
      }
    });

  }



  step = 0;
  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }
  get employeeRolesFormArray() {
    return this.employeeForm.get('employeeRoles') as FormArray;
    console.log("employeeRolesFormArray", this.employeeRolesFormArray);
  }


  updateFilteredRolesList(): void {
    this.filteredRolesList = this.rolesList.filter(role => !role.selected);
  }

  submit() {
    if (!this.submitForm()) {

      console.log("Validation errors:", this.validationErrors);
    }
  }
  submitForm(): boolean {
    this.validationErrors = []; // Reset validation errors array before checking
    this.checkAndLogControlErrors(this.employeeForm); // Check and log control errors

    if (this.validationErrors.length === 0) {
      this.sendData();
      return true;
    } else {
      console.log("Validation errors:", this.validationErrors);
      console.log("Error!! Form is invalid.");
      return false;
    }
  }

  checkAndLogControlErrors(control: AbstractControl, controlName: string = '') {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        this.checkAndLogControlErrors(control.get(key) as AbstractControl, `${controlName}.${key}`);
      });
    } else if (control instanceof FormArray) {
      (control as FormArray).controls.forEach((arrayControl, index) => {
        this.checkAndLogControlErrors(arrayControl, `${controlName}[${index}]`);
      });
    } else {
      const controlErrors = control.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          const errorMessage = `Control: ${controlName}, Error: ${keyError}, Value: ${controlErrors[keyError]}`;
          this.validationErrors.push(errorMessage); // Store validation error in the component's array
        });
      } else {
        // If there are no errors, remove the error message from the validationErrors array
        const errorMessageIndex = this.validationErrors.findIndex(msg => msg.startsWith(`Control: ${controlName}`));
        if (errorMessageIndex !== -1) {
          this.validationErrors.splice(errorMessageIndex, 1);
        }
      }
    }
  }
  logControlErrors(control: AbstractControl, controlName: string = '') {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        this.logControlErrors(control.get(key) as AbstractControl, `${controlName}.${key}`);
      });
    } else if (control instanceof FormArray) {
      (control as FormArray).controls.forEach((arrayControl, index) => {
        this.logControlErrors(arrayControl, `${controlName}[${index}]`);
      });
    } else {
      const controlErrors = control.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log(`Control: ${controlName}, Error: ${keyError}, Value: ${controlErrors[keyError]}`);
        });
      }
    }
  }
  sendData() {

    console.log("Form data:", this.employeeForm.value);
    this.employee = this.employeeForm.value;
    this.employeeRoles = this.employeeForm.get('employeeRoles')?.value;


    console.log("employee", this.employee, "role", this.employeeRoles);
    console.log("employeeRoles", this.employeeRoles);
    if (!this.employeeId) {
      console.error("Employee id is missing.");
      return;
    }

    for (let i = 0; i < this.employeeRoles.length; i++) {
      this.employeeRolePostModel.roleId = Number(this.employeeRoles[i].roleName);
      this.employeeRolePostModel.entryDate = this.employeeRoles[i].entryDate;
      this.employeeRolePostModel.IsManagerial = this.employeeRoles[i].isManagementRole === "1";
      this.employeeRoleResult.push(this.employeeRolePostModel);
    }
    console.log("all the roles list", this.employeeRolePostModel);
    this.employee.roles = this.employeeRoleResult;


    console.log("employee roles: ", this.employee.roles);

    //  this.employee.gender = this.employeeForm.get('maleOrFmale')?.value === "0" ? Gender.Female : Gender.Male;
    this.employeeForm.patchValue({ maleOrFmale: this.employee.gender === Gender.Female ? '0' : '1' });

    console.log("employee before send", this.employee);

    // Ensure that the id in the employee object matches the id used in the service call
    if (this.employee.id === this.employee.id) {
      this.employeeService.updateEmployee(this.employeeId, this.employee).subscribe({
        next: (res) => {
          console.log("res---->add employee", res);
          this.router.navigate(["all-employees"]);
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      console.error("Employee id mismatch.");

    }
    // Call API or perform further actions
    console.log("-----employee after send-----", this.employee)
    this.router.navigate(["all-employees"]);

  }
  startDateBeforeEntryDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = this.employeeForm.get('startDate');
    const entryDate = control.value;

    // Check if both startDate and entryDate are valid and entryDate is after startDate
    if (startDate && startDate.value && entryDate && entryDate > startDate.value) {
      return null; // Valid
    } else {
      return { 'startDateBeforeEntryDate': true }; // Invalid
    }
  }
  roleNameNotDuplicateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const employeeRoles = control.value as { roleName: string }[];
    const roleNameSet = new Set();
    for (const role of employeeRoles) {
      if (roleNameSet.has(role.roleName)) {
        return { 'roleNameDuplicate': true };
      }
      roleNameSet.add(role.roleName);
    }
    return null;
  }
  roleNameValidator(index: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedRoleNames = this.employeeRolesFormArray.value.map((role: { roleName: string }) => role.roleName);
      const roleName = control.value;
      if (selectedRoleNames.slice(0, index).includes(roleName) || selectedRoleNames.slice(index + 1).includes(roleName)) {
        return { 'roleNameDuplicate': true };
      }
      return null;
    };
  }
  identityFormatValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const identityRegex = /^\d{9}$/; // Adjust this regex according to your identity format
    return identityRegex.test(control.value) ? null : { 'invalidIdentityFormat': true };
  }

  BirthDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    const minBirthDate = new Date();
    minBirthDate
    if (selectedDate > currentDate || selectedDate > minBirthDate) {
      return { 'invalidBirthDate': true };
    }
    return null;
  }
  startDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    return selectedDate >= currentDate ? null : { 'pastStartDate': true };
  }
  entryDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = control.parent?.get('startDate')?.value;
    const entryDate = control.value;
    return startDate && entryDate && entryDate >= startDate ? null : { 'entryDateBeforeStartDate': true };
  }

  displayEmployeeRoles(currentRoles: { roleName: string, isManagementRole: string, entryDate: Date | null }[]): void {
    // Clear the employeeRoles array before displaying the roles
    this.employeeRoles = [];
    // Iterate over the currentRoles array and add each role to the employeeRoles array
    currentRoles.forEach(role => {
      this.addRole(role.roleName, role.isManagementRole, role.entryDate);

    });
  }
  formatDate(date: any): string {
    // קבע את התאריך הנוכחי
    const formattedDate = new Date(date);
    // קבע את פורמט התאריך ליום/חודש/שנה
    const day = formattedDate.getDate();
    const month = formattedDate.getMonth() + 1; // מכיוון שינואר מתחיל מ-0
    const year = formattedDate.getFullYear();

    // החזר את התאריך בפורמט הרצוי
    return `${day}/${month}/${year}`;
  }


}

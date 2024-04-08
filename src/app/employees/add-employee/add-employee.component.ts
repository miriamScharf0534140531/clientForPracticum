import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../employee.service';
import { Role } from '../../../models/Role';
import { Employee } from '../../../models/Employee';
import { RoleEmployee } from '../../../models/RoleEmployee';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent implements OnInit {
  public employeeAdd: Employee = new Employee();
  rolesEmployees: RoleEmployee[];
  roles: Role[];
  constructor(
    private _formBuilder: FormBuilder,
    private _employeeService: EmployeeService,
    public dialogRef: MatDialogRef<AddEmployeeComponent>) { }

  ngOnInit(): void {
    this._employeeService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.result;
      },
      error: (err) => {
        console.log("err", err);
      }
    })
    const rolesArray = this.addEmployeeForm.get('roles') as FormArray;
    rolesArray.setValidators(this.uniqueRoleIdValidator());
  }
  addEmployeeForm = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    tz: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^\d+$/)]],
    startDate: ['', Validators.required],
    birthDate: ['', Validators.required],
    male: ['', Validators.required],
    email: ['', Validators.pattern(/^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/)],
    roles: this._formBuilder.array([
      this._formBuilder.group({
        roleId: new FormControl('', [Validators.required]),
        managerial: new FormControl(''),
        jobStartDate: new FormControl('', [Validators.required])
      })
    ])
  });
  uniqueRoleIdValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const rolesArray = control as FormArray;
      var roleIds = rolesArray.controls.map((roleControl) => { return roleControl.get('roleId').value });
      roleIds = roleIds.filter(x => x != "");
      const isDuplicate = roleIds.some((roleId, index) => roleIds.indexOf(roleId) !== index);
      return isDuplicate ? { duplicateRoleId: true } : null;
    };
  }
  get rolesArray() {
    var x = this.addEmployeeForm.get('roles') as FormArray;
    return x;
  }
  deleteRole(role) {
    const index = this.rolesArray.controls.findIndex((control) =>
      control.get('roleId').value == role.value.roleId);
    if (index !== -1) {
      this.rolesArray.removeAt(index);
    }
  }
  addRole() {
    const newRole = this._formBuilder.group({
      roleId: ['', [Validators.required]],
      managerial: [false],
      jobStartDate: ['', [Validators.required]]
    });
    this.rolesArray.push(newRole);
  }
  onSaveClick() {
    this.employeeAdd.id = 0;
    this.employeeAdd.firstName = this.addEmployeeForm.controls.firstName.value;
    this.employeeAdd.lastName = this.addEmployeeForm.controls.lastName.value;
    this.employeeAdd.birthDate = new Date(this.addEmployeeForm.controls.birthDate.value);
    this.employeeAdd.male = this.addEmployeeForm.controls.male.value === "true";
    this.employeeAdd.email = this.addEmployeeForm.controls.email.value;
    this.employeeAdd.tz = this.addEmployeeForm.controls.tz.value;
    this.employeeAdd.startDate = new Date(this.addEmployeeForm.controls.startDate.value);
    this.employeeAdd.roles = [];
    this.addEmployeeForm.controls.roles.value.forEach(role => {
      var roleEmployeeToAdd = new RoleEmployee();
      roleEmployeeToAdd.id = 0;
      roleEmployeeToAdd.employeeId = this.employeeAdd.id;
      roleEmployeeToAdd.jobStartDate = new Date(role.jobStartDate);
      roleEmployeeToAdd.managerial = Boolean(role.managerial);
      roleEmployeeToAdd.roleId = Number(role.roleId);
      this.employeeAdd.roles.push(roleEmployeeToAdd)
    }
    )
    this._employeeService.addEmployee(this.formatDates(this.employeeAdd)).subscribe({
      next: (res) => {
        console.log("res", res);
        window.location.reload();
      },
      error: err => {
        console.error("err", err)
      }
    });
    this.dialogRef.close();
  }
  formatDates(employee: any): any {
    employee.startDate = employee.startDate.toISOString().split('T')[0];
    employee.birthDate = employee.birthDate.toISOString().split('T')[0];
    employee.roles.forEach(e => e.jobStartDate = e.jobStartDate.toISOString().split('T')[0])
    return employee;
  }
  onCancelClick() {
    this.dialogRef.close();
  }
}
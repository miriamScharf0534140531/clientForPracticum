import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { EmployeeService } from '../employee.service';
import { Employee } from '../../../models/Employee';
import { Role } from '../../../models/Role';
import { RoleEmployee } from '../../../models/RoleEmployee';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  employeeEdit: Employee;
  id: number;
  roles: Role[];
  constructor(
    private _employeeService: EmployeeService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    this.loadEmployeeDetails();
    this._employeeService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.result;
      },
      error: (err) => {
        console.log("err", err);
      }
    })
    const rolesArray = this.editForm.get('roles') as FormArray;
    rolesArray.setValidators(this.uniqueRoleIdValidator());
  }
  editForm = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    tz: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^\d+$/)]],
    startDate: ['', Validators.required],
    birthDate: ['', Validators.required],
    male: ['', Validators.required],
    email: ['', Validators.pattern(/^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/)],
    roles: this._formBuilder.array([]),
  });
  uniqueRoleIdValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const rolesArray = control as FormArray;
      var roleIds = rolesArray.controls.map((roleControl) => { return roleControl.get('roleId').value });
      console.log("rolesid", roleIds);
      roleIds = roleIds.filter(r => r != "");
      const isDuplicate = roleIds.some((roleId, index) => roleIds.indexOf(roleId) !== index);
      return isDuplicate ? { duplicateRoleId: true } : null;
    };
  }
  get rolesArray() {
    return this.editForm.get('roles') as FormArray;
  }
  loadEmployeeDetails() {
    this.id = this.data.id;
    this._employeeService.getEmployeeById(this.id).subscribe({
      next: (res: Employee) => {
        this.employeeEdit = res;
        console.log("res", this.employeeEdit);
        this.employeeEdit.roles = res.roles;
        this.patchFormValues();
      },
      error: err => {
        console.log("err", err);
      }
    });
  }
  patchFormValues() {
    this.editForm.patchValue({
      firstName: this.employeeEdit.firstName,
      lastName: this.employeeEdit.lastName,
      tz: this.employeeEdit.tz,
      startDate: this.employeeEdit.startDate.toString(),
      birthDate: this.employeeEdit.birthDate.toString(),
      male: this.employeeEdit.male.toString(),
      email: this.employeeEdit.email,
      roles: this.employeeEdit.roles
    });
    this.employeeEdit.roles.forEach(role => {
      this.rolesArray.push(this._formBuilder.group({
        roleId: new FormControl(role.roleId, [Validators.required]),
        managerial: new FormControl(role.managerial, [Validators.required]),
        jobStartDate: new FormControl(role.jobStartDate, [Validators.required]),
      }));
    });
  }
  deleteRole(role) {
    var index = this.rolesArray.controls.findIndex((control) => control.value === role.value);
    if (index !== -1) {
      this.rolesArray.removeAt(index);
    }
  }
  addRole() {
    const newRole = this._formBuilder.group({
      roleId: ['', Validators.required],
      managerial: [false, Validators.required],
      jobStartDate: ['', Validators.required]
    });
    this.rolesArray.push(newRole);
  }
  formatDates(employee: any): any {
    employee.startDate = employee.startDate.toISOString().split('T')[0];
    employee.birthDate = employee.birthDate.toISOString().split('T')[0];
    return employee;
  }
  onCancelClick() {
    this.dialogRef.close();
  }
  onSaveClick() {
    if (this.editForm.valid) {
      const updatedEmployee: Employee = {
        id: this.employeeEdit.id,
        firstName: this.editForm.value.firstName,
        lastName: this.editForm.value.lastName,
        tz: this.editForm.value.tz,
        startDate: new Date(this.editForm.value.startDate),
        birthDate: new Date(this.editForm.value.birthDate),
        male: this.editForm.value.male === "true",
        email: this.editForm.value.email,
        roles: []
      };
      this.editForm.value.roles.forEach(role => {
        var employeeRoleToAdd = new RoleEmployee();
        employeeRoleToAdd.id = 0;
        employeeRoleToAdd.jobStartDate = role["jobStartDate"];
        employeeRoleToAdd.managerial = role["managerial"];
        employeeRoleToAdd.roleId = role["roleId"];
        employeeRoleToAdd.employeeId = 0;
        updatedEmployee.roles.push(employeeRoleToAdd);
      })
      this._employeeService.updateEmployee(this.formatDates(updatedEmployee)).subscribe({
        next: (res) => {
          console.log(res);
          window.location.reload();
        },
        error: err => {
          console.log(err);
        }
      });
      this.dialogRef.close();
    }
  }
}

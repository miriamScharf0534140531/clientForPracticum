import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
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
  // public addEmployeeForm:FormGroup;
  public employeeAdd: Employee = new Employee();
  rolesEmployees: RoleEmployee[];
  roles: Role[];
  constructor(
    private _formBuilder: FormBuilder,
    private _employeeService: EmployeeService,
    public dialogRef: MatDialogRef<AddEmployeeComponent>) { }
  ngOnInit(): void {
    // this.employeeAdd=new Employee;
    this._employeeService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.result;
      },
      error: (err) => {
        console.log("errrr", err);
      }
    })
    console.log(this._formBuilder);
    console.log("xxxxxxxx", this.employeeAdd);
  }
  addEmployeeForm = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    tz: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^\d+$/)]],
    startDate: ['', Validators.required],
    birthDate: ['', Validators.required],
    male: ['', Validators.required],
    email:['',Validators.pattern(/^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/)],
    roles: this._formBuilder.array([
      this._formBuilder.group({
        roleId: new FormControl('', [Validators.required]),
        managerial: new FormControl(''),
        jobStartDate: new FormControl('', [Validators.required])
      })
    ])
    // roles: this._formBuilder.array([]),
  });
  get rolesArray() {
    // console.log("roleeee",this.addEmployeeForm.get('roles') as FormArray);  
    var x = this.addEmployeeForm.get('roles') as FormArray;
    // console.log("xxx",x);
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
    console.log("rolearraybe", this.rolesArray);
    const newRole = this._formBuilder.group({
      roleId: ['', [Validators.required]],
      managerial: [false],
      jobStartDate: ['', [Validators.required]]
    });
    this.rolesArray.push(newRole);
    // this.rolesEmployees=this.addEmployeeForm.value.roles;
    console.log("rolearrayaf", this.rolesArray);
    console.log("editform.roles", this.addEmployeeForm);
  }
  onSaveClick() {
    this.employeeAdd.id = 0;
    this.employeeAdd.firstName = this.addEmployeeForm.controls.firstName.value;
    this.employeeAdd.lastName = this.addEmployeeForm.controls.lastName.value;
    this.employeeAdd.birthDate = new Date(this.addEmployeeForm.controls.birthDate.value);
    this.employeeAdd.male = this.addEmployeeForm.controls.male.value==="true";
    this.employeeAdd.email=this.addEmployeeForm.controls.email.value;
    this.employeeAdd.tz = this.addEmployeeForm.controls.tz.value;
    this.employeeAdd.startDate = new Date(this.addEmployeeForm.controls.startDate.value);
    this.addEmployeeForm.controls.roles.value.forEach(role => {
      var roleEmployeeToAdd = new RoleEmployee();
      roleEmployeeToAdd.id = 0;
      roleEmployeeToAdd.employeeId = this.employeeAdd.id;
      roleEmployeeToAdd.jobStartDate = new Date(role.jobStartDate);
      roleEmployeeToAdd.managerial = Boolean(role.managerial);
      roleEmployeeToAdd.roleId = Number(role.roleId);
      this.employeeAdd.roles = [];
      this.employeeAdd.roles.push(roleEmployeeToAdd)
    }
    )
    this._employeeService.addEmployee(this.formatDates(this.employeeAdd)).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: err => {
        console.log(err);
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

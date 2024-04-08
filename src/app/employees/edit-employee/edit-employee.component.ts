import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
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
  // printFormControlInfo(controlName: string, roleControl: any) {
  //   console.log('FormControlName:', controlName);
  //   console.log('FormControlValue:', roleControl.value);
  // }
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
  }
  editForm = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    tz: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^\d+$/)]],
    startDate: ['', Validators.required],
    birthDate: ['', Validators.required],
    male: ['', Validators.required],
    email:['',Validators.pattern(/^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/)],
    roles: this._formBuilder.array([]),
  });
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
      email:this.employeeEdit.email,
      roles: this.employeeEdit.roles
    });
    this.employeeEdit.roles.forEach(role => {
      this.rolesArray.push(this._formBuilder.group({
        roleId: new FormControl(role.roleId, [Validators.required]),
        managerial: new FormControl(role.managerial, [Validators.required]),
        jobStartDate: new FormControl(role.jobStartDate, [Validators.required]),
      }));
    });
    console.log("this.editform",this.editForm); 
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
    employee.roles.forEach(e => e.jobStartDate = e.jobStartDate.toISOString().split('T')[0])
    return employee;
  }
  onCancelClick() {
    this.dialogRef.close();
  }
  onSaveClick() {
    if (this.editForm.valid) {
      // this.editForm.controls.roles.value.forEach(role=>{
      //   var roleEmployeeToAdd=new RoleEmployee();
      //   roleEmployeeToAdd.id=0;
      //   roleEmployeeToAdd.employeeId=this.employeeEdit.id;
      //   roleEmployeeToAdd.jobStartDate=new Date(role.jobStartDate);
      //   roleEmployeeToAdd.managerial=Boolean(role.managerial);
      //   roleEmployeeToAdd.roleId=Number(role.roleId);
      //   this.employeeEdit.roles=[];
      //   this.employeeEdit.roles.push(roleEmployeeToAdd)
      // }
      console.log("this.editform",this.editForm);
      const updatedEmployee: Employee = {
        id: this.employeeEdit.id,
        firstName: this.editForm.value.firstName,
        lastName: this.editForm.value.lastName,
        tz: this.editForm.value.tz,
        startDate: new Date(this.editForm.value.startDate),
        birthDate: new Date(this.editForm.value.birthDate),
        male:this.editForm.value.male==="true",
        email:this.editForm.value.email,
        roles: []
      };
      console.log("updateEmployee",updatedEmployee);
      this.editForm.value.roles.forEach(role => {
        var employeeRoleToAdd = new RoleEmployee();
        console.log("role", role);
        employeeRoleToAdd.id = 0;
        // employeeRoleToAdd.jobStartDate=role.jobStartDate;
        // const employeeRoleToAdd:RoleEmployee={
        //   id:0,
        //   jobStartDate:role.jobStartDate,
        //   roleId: role.roleId,
        // }
        // this.roles.push(employeeRoleToAdd)
      })
      console.log("updatedEmployee", updatedEmployee);
      this._employeeService.updateEmployee(this.formatDates(updatedEmployee)).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: err => {
          console.log(err);
        }
      });
      this.dialogRef.close();
    }
  }
}

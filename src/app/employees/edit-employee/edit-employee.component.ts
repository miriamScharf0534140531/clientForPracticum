import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../../models/Employee';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleEmployee } from '../../../models/RoleEmployee';
import { Role } from '../../../models/Role';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  public editForm: FormGroup;
  employeeEdit: Employee;
  id: number;
  // rolesEmployees: RoleEmployee[];
  roles:Role[];

  constructor(
    private _employeeService: EmployeeService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  printFormControlInfo(controlName: string, roleControl: any) {
    console.log('FormControlName:', controlName);
    console.log('FormControlValue:', roleControl.value);
  }
  ngOnInit(): void {
    this.editForm = this._formBuilder.group({ 
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      tz: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^\d+$/)]],
      startDate: ['', Validators.required],
      birthDate: ['', Validators.required],
       male: [ true, Validators.required],
      roles: this._formBuilder.array([this._formBuilder.control(''),Validators.required])
    });
       this.loadEmployeeDetails();

    this._employeeService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.result;
      },
      error: (err) => {   
        console.log("errrrrrr",err);
      }
    })
  }
  get rolesArray() {
    return this.editForm.get('roles') as FormArray;
  }
  loadEmployeeDetails() {
    this.id=this.data.id;
    this._employeeService.getEmployeeById(this.id).subscribe({
      next: (res: Employee) => {
        this.employeeEdit = res;
        console.log("res",this.employeeEdit);
        this.employeeEdit.roles=res.roles;
        this.patchFormValues();
      },
      error: err => {
        console.log("this.id",this.id);
        console.log("errrrrrrrr",err);
      }
    });
  }
  patchFormValues() {
    this.editForm.patchValue({
      firstName: this.employeeEdit.firstName,
      lastName: this.employeeEdit.lastName,
      tz: this.employeeEdit.tz,
      startDate:  this.employeeEdit.startDate ,
      birthDate: this.employeeEdit.birthDate,
       male: this.employeeEdit.male,
       roles: this.employeeEdit.roles

    });
    console.log("employeeEdit",this.employeeEdit);
    
    console.log("editform",this.editForm.value);
    
    // const rolesArray = this.editForm.get('roles') as FormArray;
    console.log("rolearraybe",this.rolesArray.value);
    console.log("beforedelete",this.rolesArray);
    
    this.rolesArray.removeAt(0);
    this.employeeEdit.roles.forEach(role => {
      this.rolesArray.push(this._formBuilder.group({
        // id: new FormControl(role.id),
        roleId:new FormControl(role.roleId,[Validators.required]),
        managerial: new FormControl(role.managerial,[Validators.required]),
        jobStartDate: new FormControl(role.jobStartDate,[Validators.required]),
        // employeeId: [role.employeeId]
      }));  
      console.log("rolearrayaf",this.rolesArray.value);
    });

  }
 deleteRole(role){
  console.log("roleArraynnn",this.rolesArray);
  
      var index= this.rolesArray.controls.findIndex((control) => control.value === role.value); 
       if (index !== -1) {
           this.rolesArray.removeAt(index);      
       }
  } 
addRole(){
  console.log("rolearraybe",this.rolesArray);
  const newRole = this._formBuilder.group({
    roleId: ['', Validators.required],
    managerial: [true, Validators.required],
    jobStartDate: ['', Validators.required]
  });
  this.rolesArray.push(newRole);
  console.log("rolearrayaf",this.rolesArray);
  console.log("editform.roles",this.editForm);
  
}
  onCancelClick(){
    this.dialogRef.close();
  }
  onSaveClick(){
    if (this.editForm.valid) {
      // יצירת עובד מהנתונים בטופס
      console.log("now editformdate",this.editForm.value.startDate);
      
      const updatedEmployee: Employee = {
        id: this.employeeEdit.id,
        firstName: this.editForm.value.firstName,
        lastName: this.editForm.value.lastName,
        tz: this.editForm.value.tz,
        startDate:this.editForm.value.startDate,
        birthDate:this.editForm.value.birthDate,
        male: this.editForm.value.male,
        roles: this.editForm.value.roles
      };
console.log("updatedEmployee",updatedEmployee);
    this._employeeService.updateEmployee(updatedEmployee).subscribe({
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

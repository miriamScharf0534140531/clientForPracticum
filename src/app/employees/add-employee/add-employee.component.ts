import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../../models/Role';
import { Employee } from '../../../models/Employee';
import { RoleEmployee } from '../../../models/RoleEmployee';
import { toArray } from 'rxjs';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent implements OnInit{
  public addEmployeeForm:FormGroup;
  public employeeAdd:Employee=new Employee();
  rolesEmployees: RoleEmployee[];
  roles:Role[];
  constructor(
    private _formBuilder: FormBuilder,
    private _employeeService: EmployeeService,
    public dialogRef: MatDialogRef<AddEmployeeComponent>){}
  ngOnInit(): void {
    // this.employeeAdd=new Employee;
    this._employeeService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.result;
      },
      error: (err) => {   
        console.log("errrr",err);
      }
    })
    console.log(this._formBuilder);
    
    this.addEmployeeForm = this._formBuilder.group({ 
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      tz: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^\d+$/)]],
      startDate: ['', Validators.required],
      birthDate: ['', Validators.required],
       male: [ true, Validators.required],
       roles: this._formBuilder.array([''])
      // roles: this._formBuilder.array([this._formBuilder.control('')])
    });
    // this.addEmployeeForm = this._formBuilder.group({ 
    //   firstName: [this.employeeAdd.firstName, Validators.required],
    //   lastName: [this.employeeAdd.lastName, Validators.required],
    //   tz: [this.employeeAdd.tz, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^\d+$/)]],
    //   startDate: [this.employeeAdd.startDate, Validators.required],
    //   birthDate: [this.employeeAdd.birthDate, Validators.required],
    //    male: [ true, Validators.required],
    //   roles: this._formBuilder.array([this._formBuilder.control('')])
    // });
    console.log("xxxxxxxx",this.employeeAdd);
    
    this.patchFormValues();
  }
  patchFormValues() {
    // this.addEmployeeForm.patchValue({
    //   firstName: this.employeeAdd.firstName,
    //   lastName: this.employeeAdd.lastName,
    //   tz: this.employeeAdd.tz,
    //   startDate:  this.employeeAdd.startDate ,
    //   birthDate: this.employeeAdd.birthDate,
    //    male: this.employeeAdd.male,
    //    roles:this.employeeAdd.roles
    // });

      
      // var rolesArray = this.addEmployeeForm.get('roles') as FormArray;
    console.log("eeee",this.addEmployeeForm.value.roles);
    console.log("removeamen",this.rolesArray);
    
    this.addEmployeeForm.value.roles.forEach(role => {
      this.rolesArray.push(this._formBuilder.group({
        roleId:new FormControl('',[Validators.required]),
        managerial: new FormControl('',[Validators.required]),
        jobStartDate: new FormControl('',[Validators.required]),
      }));  
      // this.addEmployeeForm.value.roles.subscribe();
      this.rolesArray.removeAt(0);
      console.log("rolearrayaf",this.rolesArray);
    });
  }

    get rolesArray() {
      // console.log("roleeee",this.addEmployeeForm.get('roles') as FormArray);  
      var x= this.addEmployeeForm.get('roles') as FormArray;
      console.log("xxx",x);
      return x;
    }
    deleteRole(role){
          const index = this.rolesArray.controls.findIndex((control) => control.get('roleId').value == role.roleId);
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
        console.log("editform.roles",this.addEmployeeForm);
        
      }
  onSaveClick(){
    this.employeeAdd=this.addEmployeeForm.value;
    console.log("employee add",this.employeeAdd);
    this._employeeService.addEmployee(this.employeeAdd).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: err => {
        console.log(err);
        
      }
    });
    this.dialogRef.close();
  }
  onCancelClick(){
    this.dialogRef.close();
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { EmployeeService } from './employee.service';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AllEmployeesComponent,AddEmployeeComponent,EditEmployeeComponent],
  imports: [
    CommonModule,
    EmployeeRoutingModule,FormsModule,ReactiveFormsModule,MatDialogModule,MatButtonModule 
  ],
  providers:[EmployeeService],

})
export class EmployeeModule { }

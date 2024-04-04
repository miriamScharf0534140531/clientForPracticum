import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { CommonModule } from '@angular/common';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';

const routes: Routes = [
  { path: '', redirectTo: 'all-employees', pathMatch: 'full' },
  {path:"all-employees",component:AllEmployeesComponent},
  {path:"edit/:id",component:EditEmployeeComponent},
  {path:"add",component:AddEmployeeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes),CommonModule],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }

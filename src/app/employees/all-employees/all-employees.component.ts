import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../../models/Employee';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrl: './all-employees.component.scss',
})
export class AllEmployeesComponent implements OnInit{
  employees:Employee[];
  filteredEmployees: Employee[];
  searchText = '';
  constructor (private _employeeService: EmployeeService,public dialog: MatDialog,private modalService: NgbModal){}
  ngOnInit(): void {
    this.getAllEmployee();
  }
  getAllEmployee(){
    this._employeeService.getAllEmployee().subscribe({
      next: (res) => {
        this.employees = res
        this.filteredEmployees = this.employees;
        //  console.log("thisss",this.employees)
      },
      error: (err) => {   
        console.log("errrrrrr",err);
      }
    })
  }
  deleteEmployee(em){
    this._employeeService.deleteEmployeee(em.id).subscribe({
      next: (res) => {
          console.log("isdelete?",res)
      },
      error: (err) => {        
        console.log("err",err);
      }
    })
  }
  // editEmployee(em: any){
  //   // this._router.navigate(["employee/edit", em?.id])
  //     // const dialogRef = this.dialog.open(EditEmployeeComponent, {
  //     //   width: '250px',
  //     // });
  //     this.modalService.open(EditEmployeeComponent);
  // }

  editEmployee(employee: any) {
    const dialogRef = this.dialog.open(EditEmployeeComponent, {
      data: {
        id: employee.id  // כאן משתמשים ב-id של העובד
      }
    });
  }
  addEmployee(){
    const dialogRef=this.dialog.open(AddEmployeeComponent)
  }
  exportToExcel(): void {
    this._employeeService.getAllEmployee().subscribe(data => {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
      XLSX.writeFile(workbook, 'employees.xlsx');
    });
  }
  searchEmployees(): void {
    console.log("keyup");
    
    this.filteredEmployees = this.employees.filter(employee =>
      employee.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      employee.tz.includes(this.searchText)||
      employee.birthDate.toString().includes(this.searchText) ||
      employee.startDate.toString().includes(this.searchText)
    );
  }
}

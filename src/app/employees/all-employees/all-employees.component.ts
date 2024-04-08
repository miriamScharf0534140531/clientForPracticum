import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../../models/Employee';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrl: './all-employees.component.scss',
})
export class AllEmployeesComponent implements OnInit {
  employees: Employee[];
  filteredEmployees: Employee[];
  searchText = '';
  constructor(private _employeeService: EmployeeService, public dialog: MatDialog, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllEmployee();
  }
  getAllEmployee() {
    this._employeeService.getAllEmployee().subscribe({
      next: (res) => {
        this.employees = res
        this.filteredEmployees = res;
      },
      error: (err) => {
        console.log("err", err);
      }
    })
  }
  deleteEmployee(em) {
    this._employeeService.deleteEmployeee(em.id).subscribe({
      next: (res) => {
        this.getAllEmployee();
      },
      error: (err) => {
        console.log("err", err);
      }
    })
  }
  sendEmail(employee: Employee) {
    window.location.href = `mailto:${employee.email}?subject=${encodeURIComponent(`hello to ${employee.firstName}`)}`;
  }

  editEmployee(employee: any) {
    this.dialog.open(EditEmployeeComponent, {
      data: {
        id: employee.id 
      }
    });
  }
  addEmployee() {
    this.dialog.open(AddEmployeeComponent)
  }
  exportToExcel(): void {
    this._employeeService.getAllEmployee().subscribe(data => {
      const filteredData = data.map(employee => {
        const { roles, ...employeeWithoutRoles } = employee;
        return employeeWithoutRoles;
      });
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
      XLSX.writeFile(workbook, 'employees.xlsx');
    });
  }
  printEmployee() {
    window.print();
  }
  searchEmployees(): void {
    this.filteredEmployees = this.employees.filter(employee =>
      employee.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      employee.tz.includes(this.searchText) ||
      employee.birthDate.toString().includes(this.searchText) ||
      employee.startDate.toString().includes(this.searchText)
    );
  }
}

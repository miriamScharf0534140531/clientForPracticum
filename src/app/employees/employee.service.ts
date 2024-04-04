import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../../models/Employee';
import { Role } from '../../models/Role';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  private readonly apiURL='http://localhost:5260/api/Employees';
  constructor(private _http: HttpClient) { }

  getAllEmployee(){
    return this._http.get<Employee[]>(`${this.apiURL}`)
  }
  deleteEmployeee(id:number){
    return this._http.delete<boolean>(`${this.apiURL}/${id}`)
  }
  getEmployeeById(id: number){
    return this._http.get<Employee>(`${this.apiURL}/${id}`)
  }
  updateEmployee(employee:any):Observable<any>{
    console.log("startdatebe:",employee.startDate);
    console.log("birthbe",employee.birthDate);
    //  employee.startDate = formatDateToISO(employee.startDate);
    //  employee.birthDate = formatDateToISO(employee.birthDate);
    //  employee.roles.forEach(e=>e.jobStartDate=formatDateToISO(e.jobStartDate))
    console.log("startdateaf:",employee.startDate);
    console.log("birthaf",employee.birthDate);
    console.log("employeetosend",employee);
    
    
      return this._http.put<any>(`${this.apiURL}/${employee.id}`,employee);
  }
  getAllRoles(){
    return this._http.get<any>(`http://localhost:5260/api/Roles`);
  }
  addEmployee(employee:Employee){
    console.log("employeetoadd",employee);
    
    return this._http.post<any>(this.apiURL,employee);
  }
}
// function formatDateToISO(date: Date): string {
//   return date.toISOString();
// }
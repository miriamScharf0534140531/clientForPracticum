import { RoleEmployee } from "./RoleEmployee";

export class Employee{
    id:number;
    firstName:string;
    lastName: string;
    tz:string;
    startDate:Date;
    birthDate:Date;
    male:boolean;
    email:string;
    roles:RoleEmployee[];
    // public List<EmployeeRole> Roles { get; set; }
    constructor(){}
}
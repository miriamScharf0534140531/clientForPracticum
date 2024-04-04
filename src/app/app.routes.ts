import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'employee', pathMatch: 'full' },
    { path: 'employee', loadChildren: () => import('./employees/employee.module').then(m => m.EmployeeModule)},
];

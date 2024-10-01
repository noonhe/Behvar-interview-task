import { Routes } from '@angular/router';
import { UnitsComponent } from './features/HR-management/pages/units/units.component';
import { EmployeesComponent } from './features/HR-management/pages/employees/employees.component';

export const routes: Routes = [
    { path: 'units', component: UnitsComponent },
    { path: 'employees', component: EmployeesComponent },
    { path: '', redirectTo: 'units', pathMatch: 'full' },
    { path: '**', redirectTo: 'units' }
];

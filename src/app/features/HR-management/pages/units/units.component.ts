import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Unit } from '../../models/unit.model';
import { Employee } from '../../models/employee.model';
import { UnitService } from '../../services/unit.service';
import { EmployeeService } from '../../services/employee.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
@Component({
  selector: 'app-units',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    DatePipe,

  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss'
})
export class UnitsComponent {
  unitForm: FormGroup;
  units: MatTableDataSource<Unit>;
  displayedColumns: string[] = ['name', 'status', 'establishmentDate'];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private unitService: UnitService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadUnits();
  }

  initForm() {
    this.unitForm = this.fb.group({
      name: ['', Validators.required],
      status: ['active', Validators.required],
      establishmentDate: ['', Validators.required]
    });
  }

  loadUnits() {
    this.loading = true;
    this.unitService.getUnits().subscribe(
      (units) => {
        this.units = new MatTableDataSource(units);
        this.loading = false;
      },
      (error) => {
        console.error('Error loading Units', error);
        this.loading = false;
      }
    );
  }

  onSubmit() {
    if (this.unitForm.valid) {
      this.loading = true;
      this.unitService.addUnit(this.unitForm.value).subscribe(
        () => {
          this.loadUnits();
          this.unitForm.reset();
          this.loading = false;
        },
        (error) => {
          console.error('Error adding Units', error);
          this.loading = false;
        }
      );
    }
  }

  showEmployees(unit: Unit) {
    this.employeeService.getEmployeesByUnit(unit.id).subscribe(
      (employees: Employee[]) => {
        this.router.navigate([`employees`], {queryParams:{unitId:unit.id}})
        console.log(`Employees in ${unit.name}:`, employees);
      },
      (error) => {
        console.error('Error loading employees', error);
      }
    );
  }
}

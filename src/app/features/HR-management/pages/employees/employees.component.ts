import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Employee } from '../../models/employee.model';
import { Unit } from '../../models/unit.model';
import { EmployeeService } from '../../services/employee.service';
import { UnitService } from '../../services/unit.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDetailComponent } from '../employee-detail/employee-detail.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  employeeForm: FormGroup;
  employees: MatTableDataSource<Employee>;
  units: Unit[];
  displayedColumns: string[] = ['name', 'unitId', 'gender', 'mobileNumber', 'education'];
  loading = false;

  unitId:string = null;
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private unitService: UnitService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.unitId = this.route.snapshot.queryParamMap.get('unitId') ?? null;
    if(!this.unitId){
      this.initForm();
      this.loadUnits();
    }
    this.loadEmployees(this.unitId);
    
  }

  initForm() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      unitId: ['', Validators.required],
      gender: ['male', Validators.required],
      mobileNumber: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      education: ['', Validators.required]
    });
  }

  loadEmployees(unitId?:string) {
    this.loading = true;
    let srvc = unitId ? this.employeeService.getEmployeesByUnit(unitId) :  this.employeeService.getEmployees();
    srvc.subscribe(
      {
        next: (employees) => {
          this.employees = new MatTableDataSource(employees);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading employees', error);
          this.loading = false;
        }
      }
    );
  }

  loadUnits() {
    this.unitService.getUnits().subscribe(
      {
        next:(units) => {
          this.units = units;
        },
        error:(error) => {
          console.error('Error loading Units', error);
        }
      }
    );
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.loading = true;
      this.employeeService.addEmployee(this.employeeForm.value).subscribe(
        {
          next:() => {
          this.loadEmployees();
          this.employeeForm.reset();
          this.loading = false;
        },
        error:(error) => {
          console.error('Error adding employee', error);
          this.loading = false;
        }
      }
      );
    }
  }

  showEmployeeDetails(employee: Employee) {
    this.dialog.open(EmployeeDetailComponent, {
      width: '400px',
      data: employee
    });
  }

  getUnitName(unitId: string): string {
    const unit = this.units?.find(d => d.id === unitId);
    return unit ? unit.name : 'Unknown';
  }
}

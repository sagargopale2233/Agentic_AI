import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-data.component.html',
  styleUrl: './employee-data.component.scss'
})
export class EmployeeDataComponent {
  employees = [
    { id: 1, name: 'John Doe', role: 'Developer', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', role: 'Designer', department: 'UX' },
    { id: 3, name: 'Bob Johnson', role: 'Manager', department: 'Sales' }
  ];
}

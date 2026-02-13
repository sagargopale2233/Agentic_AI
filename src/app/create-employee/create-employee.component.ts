import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.scss'
})
export class CreateEmployeeComponent {
  employee = {
    name: '',
    role: '',
    department: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Employee Created:', this.employee);
    // Simulate navigation to Employee Data list
    this.router.navigate(['/employee-data']);
  }
}

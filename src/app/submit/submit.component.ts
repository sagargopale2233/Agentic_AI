import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit',
  standalone: true,
  imports: [],
  templateUrl: './submit.component.html',
  styleUrl: './submit.component.scss'
})
export class SubmitComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}

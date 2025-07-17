import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h1 class="title">404 - Page Not Found</h1>
      <p class="subtitle">The page you are looking for does not exist.</p>
      <a routerLink="/" class="btn btn-primary">Go back to Home</a>
    </div>
  `,
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {}

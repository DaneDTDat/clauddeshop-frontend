import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>System Settings</h2>
    <p>System-wide settings and configuration will be managed here.</p>
  `
})
export class SystemSettingsComponent {}

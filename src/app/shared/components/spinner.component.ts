import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getContainerClasses()">
      <div [class]="getSpinnerClasses()"></div>
      @if (text()) {
        <p class="mt-2 text-sm text-gray-600">{{ text() }}</p>
      }
    </div>
  `
})
export class SpinnerComponent {
  @Input() size = signal<SpinnerSize>('md');
  @Input() text = signal('');
  @Input() centered = signal(false);
  @Input() color = signal('blue');

  getContainerClasses(): string {
    const baseClasses = 'flex flex-col items-center';
    const centeredClass = this.centered() ? 'justify-center min-h-[200px]' : '';
    return `${baseClasses} ${centeredClass}`;
  }

  getSpinnerClasses(): string {
    const sizeClasses = {
      xs: 'h-4 w-4 border-2',
      sm: 'h-6 w-6 border-2',
      md: 'h-8 w-8 border-2',
      lg: 'h-12 w-12 border-3',
      xl: 'h-16 w-16 border-4'
    };

    const colorClass = `border-${this.color()}-600`;

    return `animate-spin rounded-full ${sizeClasses[this.size()]} border-t-transparent ${colorClass}`;
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gray';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getBadgeClasses">
      @if (icon) {
        <span class="mr-1">{{ icon }}</span>
      }
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: BadgeSize = 'sm';
  @Input() rounded = true;
  @Input() icon = '';
  @Input() outline = false;

  get getBadgeClasses(): string {
    const baseClasses = 'inline-flex items-center font-medium transition-colors duration-200';

    const sizeClasses = {
      xs: 'px-2 py-0.5 text-xs',
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-sm'
    };

    const roundedClass = this.rounded ? 'rounded-full' : 'rounded-md';

    const variantClasses = this.outline
      ? {
          primary: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10',
          secondary: 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-700/10',
          success: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-700/10',
          danger: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-700/10',
          warning: 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-700/10',
          info: 'bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-700/10',
          gray: 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10'
        }
      : {
          primary: 'bg-blue-100 text-blue-800',
          secondary: 'bg-gray-100 text-gray-800',
          success: 'bg-green-100 text-green-800',
          danger: 'bg-red-100 text-red-800',
          warning: 'bg-yellow-100 text-yellow-800',
          info: 'bg-cyan-100 text-cyan-800',
          gray: 'bg-gray-100 text-gray-600'
        };

    return `${baseClasses} ${sizeClasses[this.size]} ${roundedClass} ${variantClasses[this.variant]}`;
  }
}

import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type CardVariant = 'default' | 'bordered' | 'elevated' | 'flat';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getCardClasses">
      @if (title || showHeader) {
        <div class="border-b border-gray-200 px-6 py-4">
          @if (title) {
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          }
          @if (subtitle) {
            <p class="mt-1 text-sm text-gray-600">{{ subtitle }}</p>
          }
          <ng-content select="[card-header]"></ng-content>
        </div>
      }

      <div [class]="getBodyClasses">
        <ng-content></ng-content>
      </div>

      @if (showFooter) {
        <div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <ng-content select="[card-footer]"></ng-content>
        </div>
      }
    </div>
  `
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() variant: CardVariant = 'default';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() hoverable = false;
  @Input() showHeader = false;
  @Input() showFooter = false;

  get getCardClasses(): string {
    const baseClasses = 'bg-white rounded-xl transition-all duration-200 overflow-hidden';

    const variantClasses = {
      default: 'shadow-sm border border-gray-200',
      bordered: 'border-2 border-gray-300',
      elevated: 'shadow-lg',
      flat: 'border border-gray-100'
    };

    const hoverClass = this.hoverable ? 'hover:shadow-md hover:scale-[1.01] cursor-pointer' : '';

    return `${baseClasses} ${variantClasses[this.variant]} ${hoverClass}`;
  }

  get getBodyClasses(): string {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    return paddingClasses[this.padding];
  }
}

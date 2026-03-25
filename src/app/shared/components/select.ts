import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full">
      @if (label()) {
        <label [for]="id()" class="block text-sm font-medium text-gray-700 mb-1">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500">*</span>
          }
        </label>
      }

      <div class="relative">
        <select
          [id]="id()"
          [name]="name()"
          [value]="value()"
          (change)="onChange($event)"
          (blur)="onBlur()"
          [disabled]="disabled()"
          [required]="required()"
          [class]="getSelectClasses()"
        >
          @if (placeholder()) {
            <option value="" disabled [selected]="!value()">{{ placeholder() }}</option>
          }
          @for (option of options(); track option.value) {
            <option
              [value]="option.value"
              [disabled]="option.disabled || false"
              [selected]="value() === option.value"
            >
              {{ option.label }}
            </option>
          }
        </select>

        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      @if (hint() && !hasError()) {
        <p class="mt-1 text-xs text-gray-500">{{ hint() }}</p>
      }

      @if (hasError()) {
        <p class="mt-1 text-xs text-red-600">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styles: [`
    select:focus {
      outline: none;
    }
    select {
      appearance: none;
    }
  `]
})
export class SelectComponent {
  @Input() id = signal('select-' + Math.random().toString(36).substr(2, 9));
  @Input() name = signal('');
  @Input() label = signal('');
  @Input() placeholder = signal('');
  @Input() hint = signal('');
  @Input() value = signal<any>('');
  @Input() options = signal<SelectOption[]>([]);
  @Input() disabled = signal(false);
  @Input() required = signal(false);
  @Input() size = signal<'sm' | 'md' | 'lg'>('md');

  @Output() valueChange = new EventEmitter<any>();
  @Output() blur = new EventEmitter<void>();

  private touched = signal(false);
  errorMessage = signal<string | null>(null);

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newValue = target.value;
    this.value.set(newValue);
    this.valueChange.emit(newValue);

    if (this.touched()) {
      this.validate();
    }
  }

  onBlur(): void {
    this.touched.set(true);
    this.validate();
    this.blur.emit();
  }

  private validate(): void {
    if (this.required() && !this.value()) {
      this.errorMessage.set('Este campo es requerido');
      return;
    }
    this.errorMessage.set(null);
  }

  hasError(): boolean {
    return this.touched() && !!this.errorMessage();
  }

  getSelectClasses(): string {
    const baseClasses = 'block w-full rounded-lg border transition-all duration-200 pr-10';

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    };

    const stateClasses = this.hasError()
      ? 'border-red-300 text-red-900 focus:ring-2 focus:ring-red-500 focus:border-red-500'
      : this.disabled()
      ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
      : 'border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 bg-white';

    return `${baseClasses} ${sizeClasses[this.size()]} ${stateClasses}`;
  }
}

import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'datetime-local';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full">
      @if (label) {
        <label [for]="id" class="block text-sm font-medium text-gray-700 mb-1">
          {{ label }}
          @if (required) {
            <span class="text-red-500">*</span>
          }
        </label>
      }

      <div class="relative">
        <input
          [id]="id"
          [type]="type"
          [name]="name"
          [value]="value"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [readonly]="readonly"
          [min]="min"
          [max]="max"
          [attr.minlength]="minLength"
          [attr.maxlength]="maxLength"
          [attr.pattern]="pattern || null"
          [autocomplete]="autocomplete"
          [class]="getInputClasses()"
        />

        @if (showCharCount && maxLength && type === 'text') {
          <div class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {{ value.length }}/{{ maxLength }}
          </div>
        }
      </div>

      @if (hint && !hasError()) {
        <p class="mt-1 text-xs text-gray-500">{{ hint }}</p>
      }

      @if (hasError()) {
        <p class="mt-1 text-xs text-red-600">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styles: [`
    input:focus {
      outline: none;
    }
  `]
})
export class InputComponent {
  @Input() id = 'input-' + Math.random().toString(36).substr(2, 9);
  @Input() name = '';
  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() value = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() autocomplete = 'off';

  // Validaciones
  @Input() minLength: number | null = null;
  @Input() maxLength: number | null = null;
  @Input() min: string | number | null = null;
  @Input() max: string | number | null = null;
  @Input() pattern: string | null = null;
  @Input() customValidator: ((value: string) => string | null) | null = null;

  // Estilo
  @Input() fullWidth = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showCharCount = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  private touched = signal(false);
  errorMessage = signal<string | null>(null);

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    this.value = newValue;
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
    const val = this.value;

    // Required
    if (this.required && !val.trim()) {
      this.errorMessage.set('Este campo es requerido');
      return;
    }

    // Min length
    if (this.minLength && val.length < this.minLength) {
      this.errorMessage.set(`Mínimo ${this.minLength} caracteres`);
      return;
    }

    // Max length
    if (this.maxLength && val.length > this.maxLength) {
      this.errorMessage.set(`Máximo ${this.maxLength} caracteres`);
      return;
    }

    // Pattern
    if (this.pattern && val) {
      const regex = new RegExp(this.pattern);
      if (!regex.test(val)) {
        this.errorMessage.set('Formato inválido');
        return;
      }
    }

    // Email validation
    if (this.type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        this.errorMessage.set('Email inválido');
        return;
      }
    }

    // Custom validator
    if (this.customValidator && val) {
      const customError = this.customValidator(val);
      if (customError) {
        this.errorMessage.set(customError);
        return;
      }
    }

    this.errorMessage.set(null);
  }

  hasError(): boolean {
    return this.touched() && !!this.errorMessage();
  }

  getInputClasses(): string {
    const baseClasses = 'block w-full rounded-lg border transition-all duration-200';

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    };

    const stateClasses = this.hasError()
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
      : this.disabled
      ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
      : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400';

    return `${baseClasses} ${sizeClasses[this.size]} ${stateClasses}`;
  }
}

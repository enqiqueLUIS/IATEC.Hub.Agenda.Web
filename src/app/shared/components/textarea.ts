import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
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
        <textarea
          [id]="id()"
          [name]="name()"
          [value]="value()"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [required]="required()"
          [readonly]="readonly()"
          [rows]="rows()"
          [attr.minlength]="minLength()"
          [attr.maxlength]="maxLength()"
          [class]="getTextareaClasses()"
        ></textarea>

        @if (showCharCount() && maxLength()) {
          <div class="absolute right-3 bottom-3 text-xs text-gray-400 bg-white px-1">
            {{ value().length }}/{{ maxLength() }}
          </div>
        }
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
    textarea:focus {
      outline: none;
    }
    textarea {
      resize: vertical;
    }
  `]
})
export class TextareaComponent {
  @Input() id = signal('textarea-' + Math.random().toString(36).substr(2, 9));
  @Input() name = signal('');
  @Input() label = signal('');
  @Input() placeholder = signal('');
  @Input() hint = signal('');
  @Input() value = signal('');
  @Input() disabled = signal(false);
  @Input() readonly = signal(false);
  @Input() required = signal(false);
  @Input() rows = signal(3);

  // Validaciones
  @Input() minLength = signal<number | null>(null);
  @Input() maxLength = signal<number | null>(null);

  // Estilo
  @Input() showCharCount = signal(false);
  @Input() size = signal<'sm' | 'md' | 'lg'>('md');

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  private touched = signal(false);
  errorMessage = signal<string | null>(null);

  #validateEffect = effect(() => {
    if (this.touched()) {
      this.validate();
    }
  });

  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
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
    const val = this.value();

    if (this.required() && !val.trim()) {
      this.errorMessage.set('Este campo es requerido');
      return;
    }

    if (this.minLength() && val.length < this.minLength()!) {
      this.errorMessage.set(`Mínimo ${this.minLength()} caracteres`);
      return;
    }

    if (this.maxLength() && val.length > this.maxLength()!) {
      this.errorMessage.set(`Máximo ${this.maxLength()} caracteres`);
      return;
    }

    this.errorMessage.set(null);
  }

  hasError(): boolean {
    return this.touched() && !!this.errorMessage();
  }

  getTextareaClasses(): string {
    const baseClasses = 'block w-full rounded-lg border transition-all duration-200';

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    };

    const stateClasses = this.hasError()
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
      : this.disabled()
      ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
      : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400';

    return `${baseClasses} ${sizeClasses[this.size()]} ${stateClasses}`;
  }
}

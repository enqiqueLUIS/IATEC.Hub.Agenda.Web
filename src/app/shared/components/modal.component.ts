import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto" [attr.aria-labelledby]="title ? 'modal-title' : null" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity duration-300"
          [class.opacity-100]="isOpen"
          [class.opacity-0]="!isOpen"
          (click)="handleBackdropClick()"
        ></div>

        <!-- Modal Container -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <div
            [class]="getModalClasses"
            class="relative transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300"
            [class.scale-100]="isOpen"
            [class.scale-95]="!isOpen"
          >
            <!-- Header -->
            @if (title || showCloseButton) {
              <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                @if (title) {
                  <h3 id="modal-title" class="text-lg font-semibold text-gray-900">
                    {{ title }}
                  </h3>
                }
                @if (showCloseButton) {
                  <button
                    type="button"
                    (click)="closeModal()"
                    class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                }
              </div>
            }

            <!-- Body -->
            <div [class]="getBodyClasses">
              <ng-content></ng-content>
            </div>

            <!-- Footer -->
            @if (showFooter) {
              <div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <ng-content select="[modal-footer]"></ng-content>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: ModalSize = 'md';
  @Input() showCloseButton = true;
  @Input() closeOnBackdrop = true;
  @Input() showFooter = false;

  @Output() close = new EventEmitter<void>();

  handleBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.close.emit();
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  get getModalClasses(): string {
    const sizeClasses = {
      sm: 'max-w-sm w-full',
      md: 'max-w-md w-full',
      lg: 'max-w-2xl w-full',
      xl: 'max-w-4xl w-full',
      full: 'max-w-7xl w-full mx-4'
    };

    return sizeClasses[this.size];
  }

  get getBodyClasses(): string {
    const baseClasses = 'px-6 py-4';
    return baseClasses;
  }
}

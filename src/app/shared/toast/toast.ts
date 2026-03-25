import {
  Component, Input, OnInit, OnDestroy, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'update' | 'delete';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative flex items-start gap-3 w-80 rounded-lg shadow-lg border-l-4 p-4 bg-white transition-all"
      [ngClass]="borderClass"
      (mouseenter)="pause()"
      (mouseleave)="resume()"
    >
      <!-- Icon -->
      <div class="mt-0.5 shrink-0" [innerHTML]="svgIcon"></div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900">{{ title }}</p>
        <p class="text-sm text-gray-600 mt-0.5">{{ message }}</p>
        <button
          *ngIf="actionText && action"
          (click)="clickAction($event)"
          class="mt-2 text-xs font-medium underline"
          [ngClass]="actionColorClass"
        >{{ actionText }}</button>
      </div>

      <!-- Close -->
      <button
        (click)="close()"
        class="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Progress bar -->
      <div class="absolute bottom-0 left-0 h-1 rounded-b-lg" [ngClass]="progressClass"
           [style.width.%]="progress" [style.transition]="progressTransition"></div>
    </div>
  `
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() message = '';
  @Input() type: ToastType = 'info';
  @Input() duration = 3500;
  @Input() actionText?: string;
  @Input() action?: () => void;

  private sanitizer = inject(DomSanitizer);

  progress = 100;
  paused = false;

  #afterClosed = new ReplaySubject<void>(1);
  readonly afterClosed$ = this.#afterClosed.asObservable();

  private timer?: any;
  private progressTimer?: any;
  private remaining = 0;
  private start = 0;

  get borderClass() {
    return {
      'border-green-500': this.type === 'success',
      'border-red-500':   this.type === 'error' || this.type === 'delete',
      'border-blue-500':  this.type === 'info',
      'border-yellow-500':this.type === 'warning',
      'border-indigo-500':this.type === 'update',
    };
  }

  get progressClass() {
    return {
      'bg-green-500': this.type === 'success',
      'bg-red-500':   this.type === 'error' || this.type === 'delete',
      'bg-blue-500':  this.type === 'info',
      'bg-yellow-500':this.type === 'warning',
      'bg-indigo-500':this.type === 'update',
    };
  }

  get actionColorClass() {
    return {
      'text-green-600': this.type === 'success',
      'text-red-600':   this.type === 'error' || this.type === 'delete',
      'text-blue-600':  this.type === 'info',
      'text-yellow-600':this.type === 'warning',
      'text-indigo-600':this.type === 'update',
    };
  }

  get progressTransition() {
    return this.paused ? 'none' : `width ${this.remaining}ms linear`;
  }

  get svgIcon(): SafeHtml {
    const icons: Record<ToastType, string> = {
      success: `<svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
      error:   `<svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
      info:    `<svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/></svg>`,
      warning: `<svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>`,
      update:  `<svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582M20 20v-5h-.582M4.582 9A8 8 0 0120 12M19.418 15A8 8 0 014 12"/></svg>`,
      delete:  `<svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18"/></svg>`,
    };
    return this.sanitizer.bypassSecurityTrustHtml(icons[this.type]);
  }

  ngOnInit(): void {
    this.remaining = this.duration;
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    clearInterval(this.progressTimer);
  }

  private startTimer(): void {
    this.start = Date.now();
    this.timer = setTimeout(() => this.close(), this.remaining);
    this.animateProgress();
  }

  private animateProgress(): void {
    const tick = 50;
    this.progressTimer = setInterval(() => {
      if (this.paused) return;
      const elapsed = Date.now() - this.start;
      this.progress = Math.max(0, 100 - (elapsed / this.duration) * 100);
    }, tick);
  }

  pause(): void {
    if (this.paused) return;
    this.paused = true;
    clearTimeout(this.timer);
    this.remaining = Math.max(0, this.remaining - (Date.now() - this.start));
  }

  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    this.start = Date.now();
    this.timer = setTimeout(() => this.close(), this.remaining);
  }

  clickAction(ev: MouseEvent): void {
    ev.stopPropagation();
    this.action?.();
    this.close();
  }

  close(): void {
    clearTimeout(this.timer);
    clearInterval(this.progressTimer);
    this.#afterClosed.next();
    this.#afterClosed.complete();
  }
}
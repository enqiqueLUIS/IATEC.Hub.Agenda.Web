import {
  Injectable, ApplicationRef, EnvironmentInjector,
  createComponent, ComponentRef, inject
} from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { ToastComponent, ToastType } from './toast';

export interface ToastConfig {
  duration?: number;
  type?: ToastType;
  actionText?: string;
  action?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  private container?: HTMLElement;
  private toasts: ComponentRef<ToastComponent>[] = [];

  open(title: string, message: string, cfg?: ToastConfig): Observable<void> {
    const ref = createComponent(ToastComponent, { environmentInjector: this.injector });
    const type = cfg?.type ?? 'info';

    ref.instance.title = title;
    ref.instance.message = message;
    ref.instance.type = type;
    ref.instance.duration = cfg?.duration ?? 3500;

    if (cfg?.action) {
      ref.instance.actionText = cfg.actionText ?? 'Aceptar';
      ref.instance.action = cfg.action;
    }

    this.mount(ref);

    const closed$ = new ReplaySubject<void>(1);
    ref.instance.afterClosed$.subscribe(() => {
      this.unmount(ref);
      closed$.next();
      closed$.complete();
    });

    return closed$.asObservable();
  }

  success(message: string, title = 'Éxito', duration?: number) {
    return this.open(title, message, { type: 'success', duration });
  }

  error(message: string, title = 'Error', duration?: number) {
    return this.open(title, message, { type: 'error', duration });
  }

  info(message: string, title = 'Información', duration?: number) {
    return this.open(title, message, { type: 'info', duration });
  }

  warning(message: string, title = 'Advertencia', duration?: number) {
    return this.open(title, message, { type: 'warning', duration });
  }

  update(message: string, title = 'Actualizado', duration?: number) {
    return this.open(title, message, { type: 'update', duration });
  }

  delete(message: string, title = 'Eliminado', duration?: number) {
    return this.open(title, message, { type: 'delete', duration });
  }

  private ensureContainer(): void {
    if (this.container) return;
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:16px;right:16px;display:flex;flex-direction:column;gap:10px;z-index:10050;pointer-events:none';
    document.body.appendChild(el);
    this.container = el;
  }

  private mount(ref: ComponentRef<ToastComponent>): void {
    this.ensureContainer();
    const host = ref.location.nativeElement as HTMLElement;
    host.style.pointerEvents = 'auto';
    this.appRef.attachView(ref.hostView);
    this.container!.appendChild(host);
    this.toasts.push(ref);
    ref.changeDetectorRef.detectChanges();
  }

  private unmount(ref: ComponentRef<ToastComponent>): void {
    const i = this.toasts.indexOf(ref);
    if (i > -1) this.toasts.splice(i, 1);
    this.appRef.detachView(ref.hostView);
    ref.location.nativeElement.remove();
    ref.destroy();
    if (this.toasts.length === 0 && this.container) {
      this.container.remove();
      this.container = undefined;
    }
  }
}
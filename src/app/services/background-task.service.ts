import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackgroundTaskService {
  private intervals = new Set<any>();
  private timeouts = new Set<any>();
  private subscriptions = new Set<Subscription>();

  setInterval(handler: TimerHandler, timeout?: number, ...args: any[]): any {
    const id = setInterval(handler, timeout, ...args);
    this.intervals.add(id);
    return id;
  }

  setTimeout(handler: TimerHandler, timeout?: number, ...args: any[]): any {
    const id = setTimeout(() => {
      this.timeouts.delete(id);

      if (typeof handler === 'function') {
        handler(...args);
      } else {
        new Function(handler)();
      }
    }, timeout);

    this.timeouts.add(id);
    return id;
  }

  registerInterval(id: any): any {
    this.intervals.add(id);
    return id;
  }

  registerTimeout(id: any): any {
    this.timeouts.add(id);
    return id;
  }

  registerSubscription(subscription: Subscription): Subscription {
    this.subscriptions.add(subscription);
    return subscription;
  }

  clearTimer(id: any): void {
    clearInterval(id);
    clearTimeout(id);
    this.intervals.delete(id);
    this.timeouts.delete(id);
  }

  clearAll(): void {
    this.intervals.forEach((id) => clearInterval(id));
    this.timeouts.forEach((id) => clearTimeout(id));
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());

    this.intervals.clear();
    this.timeouts.clear();
    this.subscriptions.clear();
  }
}

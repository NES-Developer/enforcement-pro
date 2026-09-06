import { Injectable } from '@angular/core';
import { DataService } from './enforcementpro/data.service';

@Injectable({
  providedIn: 'root'
})
export class LemoEncourageService {
  constructor(private data: DataService) {}

  recordPosted(): number {
    return this.data.incrementPostedFpnCount();
  }

  line(count?: number): string {
    const n = count ?? this.data.getPostedFpnCount();

    if (n <= 1) {
      return 'Good job. Let’s find another offence.';
    }
    if (n === 2) {
      return 'Two FPNs in. Keep that pace going.';
    }
    if (n === 3) {
      return 'Wow, 3 FPNs. You are on a roll.';
    }
    if (n === 4) {
      return 'Four already. Another offence will not stand a chance.';
    }
    if (n === 5) {
      return 'Five FPNs. That is a strong shift.';
    }

    return `Wow, ${n} FPNs. You are on a roll. Let’s find another offence.`;
  }

  prefixed(count?: number): string {
    return `Lemo AI: ${this.line(count)}`;
  }
}

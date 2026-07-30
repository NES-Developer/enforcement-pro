import { Injectable } from '@angular/core';
import { PatrolSession } from '../models/patrol-session';
import { DataService } from './enforcementpro/data.service';

@Injectable({
    providedIn: 'root'
})
export class PatrolService {
    private readonly defaultPatrolHours = 8;

    constructor(private data: DataService) {}

    getCurrentSession(): PatrolSession | null {
        const session = this.data.getPatrolSession();
        return session?.id ? session : null;
    }

    isOnPatrol(): boolean {
        const session = this.getCurrentSession();

        if (!session || !session.is_on_patrol || session.ended_at) {
            return false;
        }

        const now = Date.now();
        const start = Date.parse(session.started_at);
        const end = Date.parse(session.scheduled_end_at);

        if (Number.isNaN(start) || Number.isNaN(end)) {
            return false;
        }

        return now >= start && now <= end;
    }

    canUseFpnTools(): boolean {
        return this.isOnPatrol();
    }

    startPatrol(hours: number = this.defaultPatrolHours): PatrolSession {
        const user = this.data.getUser();
        const site = this.data.getSelectedSite();
        const zone = this.data.getSelectedZone();
        const startedAt = new Date();
        const endAt = new Date(startedAt.getTime() + this.normaliseHours(hours) * 60 * 60 * 1000);

        const session = new PatrolSession();
        session.id = `${user?.id || '0'}-${startedAt.getTime()}`;
        session.user_id = (user?.id || 0).toString();
        session.site_id = (site?.id || 0).toString();
        session.zone_id = (zone?.id || 0).toString();
        session.started_at = startedAt.toISOString();
        session.scheduled_end_at = endAt.toISOString();
        session.is_on_patrol = true;

        this.data.setPatrolSession(session);
        return session;
    }

    endPatrol(): PatrolSession | null {
        const session = this.getCurrentSession();

        if (!session) {
            return null;
        }

        session.is_on_patrol = false;
        session.ended_at = new Date().toISOString();
        this.data.setPatrolSession(session);

        return session;
    }

    updateLastFix(lat: string, lng: string): void {
        const session = this.getCurrentSession();

        if (!session) {
            return;
        }

        session.last_lat = lat;
        session.last_lng = lng;
        session.last_tracked_at = new Date().toISOString();
        this.data.setPatrolSession(session);
    }

    getStatusText(): string {
        const session = this.getCurrentSession();

        if (!session) {
            return 'Not on patrol';
        }

        if (this.isOnPatrol()) {
            return `On patrol until ${this.formatDateTime(session.scheduled_end_at)}`;
        }

        if (session.ended_at) {
            return `Patrol ended ${this.formatDateTime(session.ended_at)}`;
        }

        return `Patrol window ended ${this.formatDateTime(session.scheduled_end_at)}`;
    }

    getHoursText(): string {
        const session = this.getCurrentSession();

        if (!session) {
            return 'Start a patrol shift to unlock FPN tools.';
        }

        return `${this.formatDateTime(session.started_at)} to ${this.formatDateTime(session.scheduled_end_at)}`;
    }

    private normaliseHours(hours: number): number {
        if (!Number.isFinite(hours) || hours <= 0) {
            return this.defaultPatrolHours;
        }

        return Math.min(Math.max(hours, 1), 16);
    }

    private formatDateTime(value: string): string {
        if (!value) {
            return 'unknown';
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return 'unknown';
        }

        return date.toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'short'
        });
    }
}

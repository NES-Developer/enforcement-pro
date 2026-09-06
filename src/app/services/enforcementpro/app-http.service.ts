import { Injectable, Injector } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

export interface AppHttpOptions {
    auth?: boolean;
    allowRefresh?: boolean;
    timeoutMs?: number;
    headers?: Record<string, string>;
}

@Injectable({
    providedIn: 'root'
})
export class AppHttpService {
    constructor(
        private data: DataService,
        private injector: Injector
    ) {}

    get(url: string, options: AppHttpOptions = {}): Observable<any> {
        return from(this.request('GET', url, undefined, options));
    }

    post(url: string, data: any = {}, options: AppHttpOptions = {}): Observable<any> {
        return from(this.request('POST', url, data, options));
    }

    put(url: string, data: any = {}, options: AppHttpOptions = {}): Observable<any> {
        return from(this.request('PUT', url, data, options));
    }

    delete(url: string, options: AppHttpOptions = {}): Observable<any> {
        return from(this.request('DELETE', url, undefined, options));
    }

    async request(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        url: string,
        data?: any,
        options: AppHttpOptions = {},
        isRetry = false
    ): Promise<any> {
        const timeoutMs = options.timeoutMs ?? 30000;
        const useAuth = options.auth !== false;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        if (useAuth) {
            const token = this.data.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        try {
            const response = await CapacitorHttp.request({
                method,
                url,
                headers,
                data: method === 'GET' ? undefined : data,
                connectTimeout: Math.min(timeoutMs, 30000),
                readTimeout: timeoutMs
            });

            const payload = this.parseNativeData(response.data);

            if (response.status >= 200 && response.status < 300) {
                return payload;
            }

            if (
                response.status === 401
                && useAuth
                && options.allowRefresh !== false
                && !isRetry
                && !this.isLoginUrl(url)
            ) {
                const refreshed = await this.auth().refreshSession();
                if (refreshed) {
                    return this.request(method, url, data, options, true);
                }
            }

            throw this.toHttpLikeError(url, response.status, payload);
        } catch (error: any) {
            if (typeof error?.status === 'number') {
                throw error;
            }

            throw this.toHttpLikeError(url, 0, {
                message: error?.message || 'Could not reach the server.'
            });
        }
    }

    private auth(): AuthService {
        return this.injector.get(AuthService);
    }

    private isLoginUrl(url: string): boolean {
        return url.includes('/login');
    }

    private parseNativeData(data: any): any {
        if (typeof data !== 'string') {
            return data;
        }

        try {
            return JSON.parse(data);
        } catch {
            return { message: data };
        }
    }

    private toHttpLikeError(url: string, status: number, payload: any): Error {
        const statusText = status === 0 ? 'Unknown Error' : 'Error';
        const serverMessage = payload?.message || payload?.error;
        const message = typeof serverMessage === 'string' && serverMessage.trim()
            ? serverMessage
            : `Http failure response for ${url}: ${status} ${statusText}`;
        const error: any = new Error(message);
        error.status = status;
        error.statusText = statusText;
        error.url = url;
        error.error = payload;
        return error;
    }
}

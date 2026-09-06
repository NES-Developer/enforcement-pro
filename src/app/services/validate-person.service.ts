import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppHttpService } from './enforcementpro/app-http.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatePersonService {
    private baseUrl: string = 'https://app.enforcementpro.co.uk/api/verify/idu';

    constructor(private appHttp: AppHttpService) {}

    validateIdetity(body: any): Observable<any> {
        return this.appHttp.post(this.baseUrl, body, {
            timeoutMs: 20000
        });
    }
}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

    constructor() { }

    public readonly APP_VERSION = '10.0.9';

}

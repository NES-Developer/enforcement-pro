import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/enforcementpro/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

    user: any = null;
    name: string = '';

    constructor(
        private auth: AuthService
    ) {
        
    }

    ngOnInit(): void {
        this.auth.checkLoggedIn();

        this.user = this.auth.getUser();
    }

    logout(): void {
        this.auth.logout();
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceRequest } from '../models/service-request';
import { ApiService } from '../services/enforcementpro/api.service';
import { AuthService } from '../services/enforcementpro/auth.service';
import { DataService } from '../services/enforcementpro/data.service';
import { OffenceGroup } from '../models/offence-group';
import { Offence } from '../models/offence';
import { FormGroup } from '@angular/forms';
import { SiteOffence } from '../models/site-offence';

@Component({
  selector: 'app-fpn',
  templateUrl: 'fpn.page.html',
  styleUrls: ['fpn.page.scss']
})
export class FPNPage implements OnInit {

    map: any;

    constructor(
        private auth: AuthService,
    ) {
    }

    ngOnInit() {
        //this.initMap();
        this.auth.checkLoggedIn();
    }

    currentStep: number = 1;

    nextStep() {
        if (this.currentStep < 4) {
        this.currentStep++;
        }
  } 

    previousStep() {
        if (this.currentStep > 1) {
        this.currentStep--;
        }
    }

    submitForm() {
        console.log('Form submitted!');
        // Add form submission logic here
    }

}

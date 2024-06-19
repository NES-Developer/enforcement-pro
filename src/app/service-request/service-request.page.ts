import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/enforcementpro/auth.service';
//import * as L from 'leaflet';

@Component({
  selector: 'app-service-request',
  templateUrl: 'service-request.page.html',
  styleUrls: ['service-request.page.scss']
})
export class ServiceRequestPage implements OnInit {

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

import { Component, OnInit } from '@angular/core';
//import * as L from 'leaflet';

@Component({
  selector: 'app-service-request',
  templateUrl: 'service-request.page.html',
  styleUrls: ['service-request.page.scss']
})
export class ServiceRequestPage implements OnInit {

  map: any;

  constructor() {
  }

  ngOnInit() {
    //this.initMap();
  }

  

  currentStep: number = 1;

  nextStep() {
    if (this.currentStep < 3) {
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

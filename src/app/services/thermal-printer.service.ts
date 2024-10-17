import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { ThermalPrinter } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ThermalPrinterService {

  constructor() { }

  printImage(url: string) {
    return ThermalPrinter['printImage']({ url });
  }

}

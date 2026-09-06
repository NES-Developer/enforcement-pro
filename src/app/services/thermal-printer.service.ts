import { Injectable } from '@angular/core';
import { Capacitor, CapacitorHttp, registerPlugin } from '@capacitor/core';
import { AlignmentModeEnum, SunmiPrinter } from '@kduma-autoid/capacitor-sunmi-printer';

export interface PrinterResult {
  printer: 'urovo' | 'sunmi';
  status: 'printed';
}

interface UrovoPrinterPlugin {
  printImage(options: { url: string }): Promise<PrinterResult>;
  printBase64(options: { base64: string }): Promise<PrinterResult>;
  paperFeed(options?: { dots?: number }): Promise<PrinterResult>;
}

const UrovoPrinter = registerPlugin<UrovoPrinterPlugin>('UrovoPrinter');

@Injectable({
  providedIn: 'root'
})
export class ThermalPrinterService {

  constructor() { }

  async printImageOn(url: string, printer: 'sunmi' | 'urovo'): Promise<PrinterResult> {
    if (printer === 'sunmi') {
      await this.printSunmiImageFromUrl(url);
      return { printer: 'sunmi', status: 'printed' };
    }

    if (!this.canUseNativePrinter()) {
      throw new Error('Urovo printing is only available on the Android device.');
    }

    return await UrovoPrinter.printImage({ url });
  }

  async printImage(url: string): Promise<PrinterResult> {
    const errors: string[] = [];

    try {
      await this.printSunmiImageFromUrl(url);
      return { printer: 'sunmi', status: 'printed' };
    } catch (error) {
      errors.push(`Sunmi: ${this.getErrorMessage(error)}`);
    }

    if (this.canUseNativePrinter()) {
      try {
        return await UrovoPrinter.printImage({ url });
      } catch (error) {
        errors.push(`Urovo: ${this.getErrorMessage(error)}`);
      }
    }

    throw new Error(`Unable to print ticket. ${errors.join(' ')}`);
  }

  async printBase64Image(base64Data: string): Promise<PrinterResult> {
    const cleanBase64 = this.cleanBase64(base64Data);
    const errors: string[] = [];

    try {
      await this.printSunmiBase64(cleanBase64);
      return { printer: 'sunmi', status: 'printed' };
    } catch (error) {
      errors.push(`Sunmi: ${this.getErrorMessage(error)}`);
    }

    if (this.canUseNativePrinter()) {
      try {
        return await UrovoPrinter.printBase64({ base64: cleanBase64 });
      } catch (error) {
        errors.push(`Urovo: ${this.getErrorMessage(error)}`);
      }
    }

    throw new Error(`Unable to print ticket. ${errors.join(' ')}`);
  }

  async feedPaper(): Promise<PrinterResult> {
    const errors: string[] = [];

    try {
      await SunmiPrinter.printerInit();
      await SunmiPrinter.printText({ text: '\n\n' });
      return { printer: 'sunmi', status: 'printed' };
    } catch (error) {
      errors.push(`Sunmi: ${this.getErrorMessage(error)}`);
    }

    if (this.canUseNativePrinter()) {
      try {
        return await UrovoPrinter.paperFeed({ dots: 16 });
      } catch (error) {
        errors.push(`Urovo: ${this.getErrorMessage(error)}`);
      }
    }

    throw new Error(`Unable to feed printer paper. ${errors.join(' ')}`);
  }

  private async printSunmiImageFromUrl(imageUrl: string): Promise<void> {
    const response = await CapacitorHttp.get({
      url: imageUrl,
      responseType: 'arraybuffer'
    });

    if (response.status !== 200) {
      throw new Error(`Failed to download image. Status: ${response.status}`);
    }

    const dataUrl = `data:image/png;base64,${response.data}`;
    const img = await this.loadImage(dataUrl);
    const base64 = this.resizeImageToBase64(img, 384);

    await this.printSunmiBase64(base64);
  }

  private async printSunmiBase64(base64Data: string): Promise<void> {
    await SunmiPrinter.printerInit();
    await SunmiPrinter.setAlignment({
      alignment: AlignmentModeEnum.CENTER
    });
    await SunmiPrinter.printBitmap({
      bitmap: this.cleanBase64(base64Data)
    });
    await SunmiPrinter.lineWrap({ lines: 4 });
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Canvas failed to load native image data'));
      img.src = src;
    });
  }

  private resizeImageToBase64(img: HTMLImageElement, targetWidth: number): string {
    const canvas = document.createElement('canvas');
    const scaleFactor = targetWidth / img.width;

    canvas.width = targetWidth;
    canvas.height = img.height * scaleFactor;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not create 2D Canvas context');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return this.cleanBase64(canvas.toDataURL('image/png'));
  }

  private cleanBase64(base64Data: string): string {
    return base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  }

  private canUseNativePrinter(): boolean {
    return Capacitor.getPlatform() === 'android';
  }

  private getErrorMessage(error: any): string {
    return error?.message || error?.errorMessage || 'Unknown printer error.';
  }

}

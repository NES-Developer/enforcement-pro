import { Injectable } from '@angular/core';
import { Capacitor, CapacitorHttp, registerPlugin } from '@capacitor/core';
import { AlignmentModeEnum, SunmiPrinter } from '@kduma-autoid/capacitor-sunmi-printer';
import * as i0 from "@angular/core";
const UrovoPrinter = registerPlugin('UrovoPrinter');
export class ThermalPrinterService {
    static { this.receiptWidthPx = 384; }
    constructor() { }
    async printImageOn(url, printer) {
        if (printer === 'sunmi') {
            await this.printSunmiImageFromUrl(url);
            return { printer: 'sunmi', status: 'printed' };
        }
        if (!this.canUseNativePrinter()) {
            throw new Error('Urovo printing is only available on the Android device.');
        }
        return await UrovoPrinter.printImage({ url });
    }
    async printImage(url) {
        const errors = [];
        try {
            await this.printSunmiImageFromUrl(url);
            return { printer: 'sunmi', status: 'printed' };
        }
        catch (error) {
            errors.push(`Sunmi: ${this.getErrorMessage(error)}`);
        }
        if (this.canUseNativePrinter()) {
            try {
                return await UrovoPrinter.printImage({ url });
            }
            catch (error) {
                errors.push(`Urovo: ${this.getErrorMessage(error)}`);
            }
        }
        throw new Error(`Unable to print ticket. ${errors.join(' ')}`);
    }
    async printBase64Image(base64Data) {
        const receiptImage = await this.toReceiptBitmap(base64Data);
        const errors = [];
        try {
            await this.printSunmiBase64(receiptImage);
            return { printer: 'sunmi', status: 'printed' };
        }
        catch (error) {
            errors.push(`Sunmi: ${this.getErrorMessage(error)}`);
        }
        if (this.canUseNativePrinter()) {
            try {
                return await UrovoPrinter.printBase64({ base64: receiptImage });
            }
            catch (error) {
                errors.push(`Urovo: ${this.getErrorMessage(error)}`);
            }
        }
        throw new Error(`Unable to print ticket. ${errors.join(' ')}`);
    }
    async toReceiptBitmap(base64Data) {
        const dataUrl = `data:image/png;base64,${this.cleanBase64(base64Data)}`;
        const img = await this.loadImage(dataUrl);
        return this.resizeImageToBase64(img, ThermalPrinterService.receiptWidthPx);
    }
    async feedPaper() {
        const errors = [];
        try {
            await SunmiPrinter.printerInit();
            await SunmiPrinter.printText({ text: '\n\n' });
            return { printer: 'sunmi', status: 'printed' };
        }
        catch (error) {
            errors.push(`Sunmi: ${this.getErrorMessage(error)}`);
        }
        if (this.canUseNativePrinter()) {
            try {
                return await UrovoPrinter.paperFeed({ dots: 16 });
            }
            catch (error) {
                errors.push(`Urovo: ${this.getErrorMessage(error)}`);
            }
        }
        throw new Error(`Unable to feed printer paper. ${errors.join(' ')}`);
    }
    async printSunmiImageFromUrl(imageUrl) {
        const response = await CapacitorHttp.get({
            url: imageUrl,
            responseType: 'arraybuffer'
        });
        if (response.status !== 200) {
            throw new Error(`Failed to download image. Status: ${response.status}`);
        }
        const dataUrl = `data:image/png;base64,${response.data}`;
        const img = await this.loadImage(dataUrl);
        const base64 = this.resizeImageToBase64(img, ThermalPrinterService.receiptWidthPx);
        await this.printSunmiBase64(base64);
    }
    async printSunmiBase64(base64Data) {
        await SunmiPrinter.printerInit();
        await SunmiPrinter.setAlignment({
            alignment: AlignmentModeEnum.CENTER
        });
        await SunmiPrinter.printBitmap({
            bitmap: this.cleanBase64(base64Data)
        });
        await SunmiPrinter.lineWrap({ lines: 4 });
    }
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Canvas failed to load native image data'));
            img.src = src;
        });
    }
    resizeImageToBase64(img, targetWidth) {
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
    cleanBase64(base64Data) {
        return base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    }
    canUseNativePrinter() {
        return Capacitor.getPlatform() === 'android';
    }
    getErrorMessage(error) {
        return error?.message || error?.errorMessage || 'Unknown printer error.';
    }
    static { this.ɵfac = function ThermalPrinterService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ThermalPrinterService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ThermalPrinterService, factory: ThermalPrinterService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ThermalPrinterService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [], null); })();
//# sourceMappingURL=thermal-printer.service.js.map
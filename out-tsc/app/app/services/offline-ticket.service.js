import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { ThermalPrinterService } from './thermal-printer.service';
import * as i0 from "@angular/core";
import * as i1 from "../Service/ticket.service";
import * as i2 from "./thermal-printer.service";
export class OfflineTicketService {
    constructor(ticket, printer) {
        this.ticket = ticket;
        this.printer = printer;
    }
    async printFor(enviroPost) {
        const html = this.ticket.generateWelcomeTicket(enviroPost);
        if (!html || html === 'refresh') {
            return false;
        }
        await this.printHtml(html);
        return true;
    }
    async printHtml(ticketHTML) {
        let container = null;
        const receiptWidth = ThermalPrinterService.receiptWidthPx;
        try {
            container = document.createElement('div');
            container.style.width = `${receiptWidth}px`;
            container.style.maxWidth = `${receiptWidth}px`;
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.background = '#ffffff';
            container.style.color = '#000000';
            container.style.overflow = 'hidden';
            container.innerHTML = `
                <style>
                    html, body, section { width: ${receiptWidth}px !important; max-width: ${receiptWidth}px !important; margin: 0 !important; }
                    img { max-width: 100% !important; height: auto !important; }
                </style>
                ${ticketHTML}
            `;
            document.body.appendChild(container);
            await new Promise(resolve => setTimeout(resolve, 400));
            const canvas = await html2canvas(container, {
                width: receiptWidth,
                windowWidth: receiptWidth,
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false
            });
            const base64Data = canvas.toDataURL('image/png').split(',')[1];
            await this.printer.printBase64Image(base64Data);
        }
        finally {
            if (container?.parentNode) {
                document.body.removeChild(container);
            }
        }
    }
    static { this.ɵfac = function OfflineTicketService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || OfflineTicketService)(i0.ɵɵinject(i1.TicketService), i0.ɵɵinject(i2.ThermalPrinterService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: OfflineTicketService, factory: OfflineTicketService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(OfflineTicketService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.TicketService }, { type: i2.ThermalPrinterService }], null); })();
//# sourceMappingURL=offline-ticket.service.js.map
import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { EnviroPost } from '../models/enviro';
import { TicketService } from '../Service/ticket.service';
import { ThermalPrinterService } from './thermal-printer.service';

@Injectable({
    providedIn: 'root'
})
export class OfflineTicketService {
    constructor(
        private ticket: TicketService,
        private printer: ThermalPrinterService
    ) {}

    async printFor(enviroPost: EnviroPost): Promise<boolean> {
        const html = this.ticket.generateWelcomeTicket(enviroPost);
        if (!html || html === 'refresh') {
            return false;
        }

        await this.printHtml(html);
        return true;
    }

    async printHtml(ticketHTML: string): Promise<void> {
        let container: HTMLDivElement | null = null;
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
        } finally {
            if (container?.parentNode) {
                document.body.removeChild(container);
            }
        }
    }
}

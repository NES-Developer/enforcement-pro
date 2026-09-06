import { TestBed } from '@angular/core/testing';

import { ThermalPrinterService } from './thermal-printer.service';

describe('ThermalPrinterService', () => {
  let service: ThermalPrinterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThermalPrinterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('shrinks a wide ticket image to receipt paper width', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 820;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    expect(ctx).toBeTruthy();
    ctx!.fillStyle = '#ffffff';
    ctx!.fillRect(0, 0, canvas.width, canvas.height);

    const receipt = await service.toReceiptBitmap(canvas.toDataURL('image/png'));
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Unable to load receipt bitmap'));
      image.src = `data:image/png;base64,${receipt}`;
    });

    expect(img.width).toBe(384);
    expect(img.height).toBe(Math.round(400 * (384 / 820)));
  });
});

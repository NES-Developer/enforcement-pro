import SignaturePad from 'signature_pad';

export function sizeSignatureCanvas(canvas: HTMLCanvasElement, fallbackWidth = 320, fallbackHeight = 160): void {
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(Math.round(rect.width) || canvas.offsetWidth || fallbackWidth, 1);
  const cssHeight = Math.max(Math.round(rect.height) || canvas.offsetHeight || fallbackHeight, 1);

  canvas.width = Math.round(cssWidth * ratio);
  canvas.height = Math.round(cssHeight * ratio);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  const context = canvas.getContext('2d');
  if (context) {
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
}

export function bindSignaturePad(
  canvas: HTMLCanvasElement,
  existing?: SignaturePad,
  fallbackWidth = 320,
  fallbackHeight = 160
): SignaturePad {
  const data = existing && !existing.isEmpty() ? existing.toData() : [];
  existing?.off();
  sizeSignatureCanvas(canvas, fallbackWidth, fallbackHeight);
  const pad = new SignaturePad(canvas);
  if (data.length) {
    pad.fromData(data);
  }
  return pad;
}

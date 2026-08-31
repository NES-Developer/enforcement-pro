export function estimateDataUrlBytes(dataUrl: string): number {
    if (!dataUrl || typeof dataUrl !== 'string') {
        return 0;
    }

    const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
    const paddingMatches = base64.match(/=+$/);
    const padding = paddingMatches ? paddingMatches[0].length : 0;

    return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

export function compressDataUrl(
    dataUrl: string,
    maxBytes: number = 220000,
    quality: number = 0.72
): Promise<string> {
    return new Promise(resolve => {
        if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
            resolve(dataUrl);
            return;
        }

        if (estimateDataUrlBytes(dataUrl) <= maxBytes) {
            resolve(dataUrl);
            return;
        }

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve(dataUrl);
                return;
            }

            let width = img.width || 640;
            let height = img.height || 480;
            let currentQuality = quality;
            let result = dataUrl;

            for (let attempt = 0; attempt < 6; attempt++) {
                canvas.width = width;
                canvas.height = height;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
                result = canvas.toDataURL('image/jpeg', currentQuality);

                if (estimateDataUrlBytes(result) <= maxBytes) {
                    resolve(result);
                    return;
                }

                currentQuality = Math.max(0.4, currentQuality - 0.1);

                if (currentQuality <= 0.45) {
                    width = Math.max(320, Math.round(width * 0.8));
                    height = Math.max(240, Math.round(height * 0.8));
                }
            }

            resolve(result);
        };

        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
    });
}

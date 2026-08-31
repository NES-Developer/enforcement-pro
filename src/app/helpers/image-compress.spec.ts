import { compressDataUrl, estimateDataUrlBytes } from './image-compress';

describe('image-compress', () => {
    const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

    it('estimates data URL size in bytes', () => {
        expect(estimateDataUrlBytes(tinyPng)).toBeGreaterThan(0);
        expect(estimateDataUrlBytes('')).toBe(0);
    });

    it('leaves small images unchanged', async () => {
        const result = await compressDataUrl(tinyPng, 220000);
        expect(result).toBe(tinyPng);
    });
});

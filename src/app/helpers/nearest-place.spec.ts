import { nearestPlaceName } from './nearest-place';

describe('nearestPlaceName', () => {
  it('picks the closest named landmark and skips street addresses', () => {
    const name = nearestPlaceName([
      { name: '12 High Street', lat: 51.4601, lng: -2.55 },
      { name: 'Central Library', lat: 51.461, lng: -2.551 },
      { name: "McDonald's, Broad Street", lat: 51.4602, lng: -2.5501 },
    ], 51.46, -2.55);

    expect(name).toBe("McDonald's");
  });

  it('returns nothing when every result is a street address', () => {
    expect(nearestPlaceName([
      { name: '12 High Street, Bristol', lat: 51.46, lng: -2.55 },
    ], 51.46, -2.55)).toBeNull();
  });
});

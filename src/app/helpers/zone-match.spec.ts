import { Zone } from '../models/zone';
import { matchZoneName } from './zone-match';

function zone(id: number, name: string, geojson: unknown = null): Zone {
  return {
    id,
    name,
    geojson,
    address_line1: '',
    address_line2: '',
    is_hotspot: '',
    post_code: '',
    site_id: '1',
    town: '',
    user_id: '',
    created_at: '',
    updated_at: '',
  };
}

describe('matchZoneName', () => {
  const easton = zone(1, 'Easton', {
    type: 'Polygon',
    coordinates: [[
      [-2.57, 51.45],
      [-2.54, 51.45],
      [-2.54, 51.47],
      [-2.57, 51.47],
      [-2.57, 51.45],
    ]],
  });
  const redland = zone(2, 'Redland', {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-2.62, 51.47],
        [-2.59, 51.47],
        [-2.59, 51.49],
        [-2.62, 51.49],
        [-2.62, 51.47],
      ]],
    },
  });

  it('uses the zone that contains the pin', () => {
    expect(matchZoneName([easton, redland], 51.46, -2.55)).toBe('Easton');
    expect(matchZoneName([easton, redland], 51.48, -2.60)).toBe('Redland');
  });

  it('uses the closest zone when the pin is outside every boundary', () => {
    expect(matchZoneName([easton, redland], 51.46, -2.50)).toBe('Easton');
    expect(matchZoneName([easton, redland], 51.49, -2.64)).toBe('Redland');
  });

  it('reads string GeoJSON and falls back to the selected zone when no boundary exists', () => {
    const encoded = zone(3, 'Ashley', JSON.stringify(easton.geojson));
    expect(matchZoneName([encoded], 51.46, -2.55)).toBe('Ashley');

    const plain = zone(4, 'Central');
    expect(matchZoneName([plain, zone(5, 'Harbour')], 0, 0, 5)).toBe('Harbour');
  });
});

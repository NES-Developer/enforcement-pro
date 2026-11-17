import { Zone } from '../models/zone';

interface LatLng {
  lat: number;
  lng: number;
}

export function matchZoneName(
  zones: Zone[] | null | undefined,
  lat: number,
  lng: number,
  preferredId?: number
): string {
  const usable = (zones || []).filter((zone) => String(zone?.name || '').trim());
  if (!usable.length) {
    return '';
  }

  const preferred = nameById(usable, preferredId);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) {
    return preferred;
  }

  const containing = usable
    .map((zone) => ({ zone, area: containingArea(zone, lat, lng) }))
    .filter((item) => item.area > 0)
    .sort((a, b) => a.area - b.area);

  if (containing.length) {
    return containing[0].zone.name;
  }

  let nearest: { name: string; distance: number } | null = null;
  for (const zone of usable) {
    const point = representativePoint(zone);
    if (!point) {
      continue;
    }
    const distance = haversine(lat, lng, point.lat, point.lng);
    if (!nearest || distance < nearest.distance) {
      nearest = { name: zone.name, distance };
    }
  }

  return nearest?.name || preferred;
}

function nameById(zones: Zone[], preferredId?: number): string {
  if (!preferredId) {
    return '';
  }
  return zones.find((zone) => Number(zone.id) === Number(preferredId))?.name || '';
}

function containingArea(zone: Zone, lat: number, lng: number): number {
  let best = 0;
  for (const ring of outerRings(zone)) {
    if (!pointInRing(lng, lat, ring)) {
      continue;
    }
    const area = Math.abs(shoelace(ring)) || 1e-12;
    if (best === 0 || area < best) {
      best = area;
    }
  }
  return best;
}

function representativePoint(zone: Zone): LatLng | null {
  const ring = outerRings(zone)[0];
  if (!ring?.length) {
    return null;
  }

  const totals = ring.reduce(
    (sum, point) => ({ lat: sum.lat + point.lat, lng: sum.lng + point.lng }),
    { lat: 0, lng: 0 }
  );
  return { lat: totals.lat / ring.length, lng: totals.lng / ring.length };
}

function outerRings(zone: Zone): LatLng[][] {
  const rings: LatLng[][] = [];
  collectPolygons(unwrap(zone?.geojson), rings);
  return rings;
}

function unwrap(value: unknown, depth = 0): unknown {
  if (typeof value !== 'string' || depth > 2) {
    return value;
  }
  try {
    return unwrap(JSON.parse(value), depth + 1);
  } catch {
    return null;
  }
}

function collectPolygons(value: unknown, rings: LatLng[][]): void {
  if (!value) {
    return;
  }

  if (Array.isArray(value)) {
    const ring = asRing(value);
    if (ring) {
      rings.push(ring);
      return;
    }
    value.forEach((item) => collectPolygons(item, rings));
    return;
  }

  if (typeof value !== 'object') {
    return;
  }

  const record = value as Record<string, unknown>;
  const type = String(record['type'] || '');

  if (type === 'FeatureCollection') {
    const features = Array.isArray(record['features']) ? record['features'] : [];
    features.forEach((feature) => collectPolygons(feature, rings));
    return;
  }

  if (type === 'Feature') {
    collectPolygons(record['geometry'], rings);
    return;
  }

  if (type === 'Polygon') {
    pushOuterRing(record['coordinates'], rings);
    return;
  }

  if (type === 'MultiPolygon' && Array.isArray(record['coordinates'])) {
    record['coordinates'].forEach((polygon) => pushOuterRing(polygon, rings));
    return;
  }

  if (record['geometry']) {
    collectPolygons(record['geometry'], rings);
  }
  if (record['geojson']) {
    collectPolygons(record['geojson'], rings);
  }
}

function pushOuterRing(coordinates: unknown, rings: LatLng[][]): void {
  if (!Array.isArray(coordinates) || !coordinates.length) {
    return;
  }
  const ring = asRing(coordinates[0]);
  if (ring) {
    rings.push(ring);
  }
}

function asRing(value: unknown): LatLng[] | null {
  if (!Array.isArray(value) || value.length < 3) {
    return null;
  }

  const positions = value
    .map((point) => asPosition(point))
    .filter((point): point is [number, number] => !!point);
  if (positions.length < 3) {
    return null;
  }

  const swapped = ringStoresLatFirst(positions);
  return positions.map(([first, second]) => (
    swapped ? { lat: first, lng: second } : { lng: first, lat: second }
  ));
}

function asPosition(point: unknown): [number, number] | null {
  if (Array.isArray(point) && point.length >= 2) {
    const first = Number(point[0]);
    const second = Number(point[1]);
    if (Number.isFinite(first) && Number.isFinite(second)) {
      return [first, second];
    }
  }

  if (point && typeof point === 'object') {
    const record = point as Record<string, unknown>;
    const lat = Number(record['lat'] ?? record['latitude']);
    const lng = Number(record['lng'] ?? record['lon'] ?? record['longitude']);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return [lng, lat];
    }
  }

  return null;
}

function ringStoresLatFirst(positions: Array<[number, number]>): boolean {
  const [first, second] = positions[0];
  return Math.abs(first) >= 49 && Math.abs(first) <= 61 && Math.abs(second) <= 20;
}

function pointInRing(lng: number, lat: number, ring: LatLng[]): boolean {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const currentPoint = ring[index];
    const previousPoint = ring[previous];
    const crossesLatitude = (currentPoint.lat > lat) !== (previousPoint.lat > lat);
    if (!crossesLatitude) {
      continue;
    }
    const edgeLng = ((previousPoint.lng - currentPoint.lng) * (lat - currentPoint.lat))
      / ((previousPoint.lat - currentPoint.lat) || 1e-12)
      + currentPoint.lng;
    if (lng < edgeLng) {
      inside = !inside;
    }
  }
  return inside;
}

function shoelace(ring: LatLng[]): number {
  let area = 0;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    area += ring[previous].lng * ring[index].lat;
    area -= ring[index].lng * ring[previous].lat;
  }
  return area / 2;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const earth = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * earth * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

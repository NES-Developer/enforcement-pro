import { isGenericPlaceText } from './place-text';

export interface PlaceCandidate {
  name: string;
  lat?: number;
  lng?: number;
}

export function landmarkName(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return '';
  }
  return raw.split(',')[0].trim();
}

export function looksLikeStreetAddress(value: string): boolean {
  return /^\d+[a-z]?(?:\/\d+)?\s+\S+/i.test(String(value || '').trim());
}

export function nearestPlaceName(
  candidates: PlaceCandidate[],
  lat: number,
  lng: number
): string | null {
  const ranked = (candidates || [])
    .map((candidate) => ({
      name: landmarkName(candidate?.name),
      lat: Number(candidate?.lat),
      lng: Number(candidate?.lng),
    }))
    .filter((candidate) => candidate.name && !isGenericPlaceText(candidate.name) && !looksLikeStreetAddress(candidate.name))
    .map((candidate) => ({
      name: candidate.name,
      distance: Number.isFinite(candidate.lat) && Number.isFinite(candidate.lng)
        ? distanceMeters(lat, lng, candidate.lat, candidate.lng)
        : Number.POSITIVE_INFINITY,
    }))
    .sort((a, b) => a.distance - b.distance);

  return ranked[0]?.name || null;
}

function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const earth = 6371000;
  const latitudeDelta = toRadians(lat2 - lat1);
  const longitudeDelta = toRadians(lng2 - lng1);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * earth * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

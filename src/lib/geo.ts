const EARTH_RADIUS_METRES = 6_371_000;
const radians = (degrees: number) => degrees * Math.PI / 180;

export function distanceMetres(lat1: number, lng1: number, lat2: number, lng2: number) {
  const dLat = radians(lat2 - lat1);
  const dLng = radians(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METRES * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

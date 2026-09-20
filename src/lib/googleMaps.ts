export async function getDrivingEtaMins(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  isAsap: boolean = false
): Promise<number | null> {
  
  function toRad(value: number) {
    return (value * Math.PI) / 180;
  }

  const R = 6371; // Earth's radius in km
  const dLat = toRad(destLat - originLat);
  const dLon = toRad(destLng - originLng);
  const lat1 = toRad(originLat);
  const lat2 = toRad(destLat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // 1. Straight-line distance in km
  const straightLineDist = R * c;

  // 2. Multiply by 1.4 for road network distance approximation
  const roadNetworkDist = straightLineDist * 1.4;

  // 3. Calculate driving time at 25 km/h
  const drivingTimeHours = roadNetworkDist / 25;
  const drivingTimeMins = drivingTimeHours * 60;

  // 4. Add 10-minute flat vendor prep & dispatch buffer
  const totalMins = drivingTimeMins + 10;

  // 5. Round up to nearest whole minute
  return Math.ceil(totalMins);
}

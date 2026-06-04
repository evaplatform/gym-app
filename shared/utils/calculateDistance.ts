// utils/runningMetrics.ts (ou .js)

type Coordinates = {
  latitude: number;
  longitude: number;
};

/**
 * Calcula a distância entre dois pontos usando a fórmula de Haversine
 * @param coordinates - Array com 1 ou 2 pontos
 * @returns Distância em QUILÔMETROS (km)
 */
export function calculateDistance(coordinates: Coordinates[]): number {
  if (coordinates.length < 2) return 0;

  // ✅ Se receber mais de 2 pontos, pega apenas os 2 primeiros
  const [point1, point2] = coordinates;

  // Fórmula de Haversine com alta precisão
  const R = 6371; // Raio da Terra em km

  const lat1Rad = deg2rad(point1.latitude);
  const lat2Rad = deg2rad(point2.latitude);
  const dLat = deg2rad(point2.latitude - point1.latitude);
  const dLon = deg2rad(point2.longitude - point1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // em km

  // ✅ Log para debug (remover em produção)
  if (distance > 0) {
    console.log(
      `[calculateDistance] ${(distance * 1000).toFixed(2)}m | ` +
        `Δlat: ${(point2.latitude - point1.latitude).toFixed(8)}° | ` +
        `Δlon: ${(point2.longitude - point1.longitude).toFixed(8)}°`,
    );
  }

  // ✅ IMPORTANTE: Retornar SEMPRE, sem filtro
  return distance;
}

/**
 * Calcula a distância total de um array de pontos
 * @param coordinates - Array com múltiplos pontos
 * @returns Distância total em QUILÔMETROS (km)
 */
export const calculateTotalDistance = (coordinates: Coordinates[]): number => {
  if (coordinates.length < 2) return 0;

  let totalDistance = 0;

  for (let i = 1; i < coordinates.length; i++) {
    const segmentDistance = calculateDistance([
      coordinates[i - 1],
      coordinates[i],
    ]);

    // ✅ Acumular TUDO, sem filtro
    totalDistance += segmentDistance;
  }

  return totalDistance;
};

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

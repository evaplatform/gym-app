  export function formatDistance(distanceInKm: number) {
    // Se a distância for menor que 1 km, mostrar em metros
    if (distanceInKm < 1) {
      const meters = Math.round(distanceInKm * 1000);
      return `${meters} m`;
    }
    // Caso contrário, mostrar em km com 2 casas decimais
    return `${distanceInKm.toFixed(2)} km`;
  };
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateDistance } from "@/shared/utils/calculateDistance";
import { LocationObjectCoords } from "expo-location";
import { StoragesEnum } from "@/shared/enum/StoragesEnum";

export const LOCATION_TRACKING = "location-tracking";

const BG_CONFIG = {
  MAX_ACCURACY: 50,
  MIN_DISTANCE_KM: 0.0003,
  MIN_TIME_S: 0.5,
  FORCE_UPDATE_S: 1.5,
  MIN_SPEED_KMPH: 0.3,
};

interface LocationCoordsWithTimestamp extends LocationObjectCoords {
  timestamp?: number;
}

interface RunningData {
  coordinates: LocationCoordsWithTimestamp[];
  distance: number;
  startTime: number;
  lastUpdate: number;
  isRunning: boolean;
  elapsedTime: number;
}

const isValidMovement = (
  distanceKm: number,
  timeDeltaS: number,
  speedKmh: number,
): { shouldAddPoint: boolean; shouldCountDistance: boolean } => {
  const distMeters = distanceKm * 1000;

  // Regra 1: Movimento com distância e tempo adequados
  if (
    distanceKm >= BG_CONFIG.MIN_DISTANCE_KM &&
    timeDeltaS >= BG_CONFIG.MIN_TIME_S
  ) {
    return { shouldAddPoint: true, shouldCountDistance: true };
  }

  // Regra 2: Velocidade GPS indica movimento
  if (speedKmh >= BG_CONFIG.MIN_SPEED_KMPH && distanceKm > 0) {
    return { shouldAddPoint: true, shouldCountDistance: true };
  }

  // Regra 3: Força update (conta se >= 5cm)
  if (timeDeltaS >= BG_CONFIG.FORCE_UPDATE_S) {
    const shouldCountDist = distMeters >= 5; // 5cm
    return { shouldAddPoint: true, shouldCountDistance: shouldCountDist };
  }

  return { shouldAddPoint: false, shouldCountDistance: false };
};

TaskManager.defineTask(
  LOCATION_TRACKING,
  async ({ data, error }: { data: any; error: any }) => {
    if (error) {
      console.error("[BG Task] Erro:", error);
      return;
    }

    if (!data?.locations?.length) {
      return;
    }

    const newCoord: LocationObjectCoords = data.locations[0].coords;
    const speedKmh = Math.max(0, (newCoord.speed ?? 0) * 3.6);

    if (
      newCoord.accuracy !== null &&
      newCoord.accuracy > BG_CONFIG.MAX_ACCURACY
    ) {
      console.log(
        `[BG] ⚠️ Precisão ruim: ${newCoord.accuracy.toFixed(1)}m (speed: ${speedKmh.toFixed(1)} km/h)`,
      );
      return;
    }

    try {
      const raw = await AsyncStorage.getItem(StoragesEnum.RUNNING_DATA_KEY);
      if (!raw) return;

      let runningData: RunningData;
      try {
        runningData = JSON.parse(raw);
      } catch (parseError) {
        console.error("[BG] Erro ao fazer parse:", parseError);
        return;
      }

      if (!runningData.isRunning) {
        console.log("[BG] Corrida pausada");
        return;
      }

      const coords = runningData.coordinates;
      const now = Date.now();

      const coordWithTimestamp: LocationCoordsWithTimestamp = {
        ...newCoord,
        timestamp: now,
      };

      if (coords.length > 0) {
        const last = coords[coords.length - 1];
        const distKm = calculateDistance([last, coordWithTimestamp]);
        const timeDeltaS = (now - (last.timestamp || 0)) / 1000;

        const validation = isValidMovement(distKm, timeDeltaS, speedKmh);

        if (validation.shouldAddPoint) {
          runningData.coordinates.push(coordWithTimestamp);

          if (validation.shouldCountDistance) {
            runningData.distance += distKm;
            console.log(
              `[BG] ✅ +${(distKm * 1000).toFixed(1)}m | ` +
                `Total: ${runningData.distance.toFixed(3)}km | ` +
                `Speed: ${speedKmh.toFixed(1)} km/h | ` +
                `Δt: ${timeDeltaS.toFixed(1)}s | ` +
                `Pontos: ${coords.length + 1}`,
            );
          } else {
            console.log(
              `[BG] 📍 Ponto adicionado mas distância não contada: ` +
                `${(distKm * 1000).toFixed(1)}m em ${timeDeltaS.toFixed(1)}s`,
            );
          }

          runningData.lastUpdate = now;
          await AsyncStorage.setItem(
            StoragesEnum.RUNNING_DATA_KEY,
            JSON.stringify(runningData),
          );
        } else {
          console.log(
            `[BG] ⏭️ Rejeitado: ${(distKm * 1000).toFixed(1)}m em ${timeDeltaS.toFixed(1)}s | ` +
              `Speed: ${speedKmh.toFixed(1)} km/h`,
          );
        }
      } else {
        runningData.coordinates.push(coordWithTimestamp);
        runningData.lastUpdate = now;
        await AsyncStorage.setItem(
          StoragesEnum.RUNNING_DATA_KEY,
          JSON.stringify(runningData),
        );
        console.log("[BG] 📍 Primeiro ponto registrado");
      }
    } catch (e) {
      console.error("[BG] Erro ao processar:", e);
    }
  },
);

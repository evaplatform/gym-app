import { DistanceUnitEnum } from '../enum/DistanceUnitEnum';
import { IDefaultEntityProperties } from '../interfaces/IDefaultEntityProperties';
import { IdType } from '../types/IdType';

export interface IExerciseHistory extends IDefaultEntityProperties {
  // Relações
  userId: IdType;
  academyId: IdType;
  exerciseId: IdType;

  // Dados gerais do treino
  completedAt: Date;
  duration: number; // em segundos ou minutos
  notes?: string; // Observações do usuário sobre o treino

  // Para exercícios de musculação/mobilidade/alongamento
  completedSets?: number;
  completedRepetitions?: number[];
  weightUsed?: number;

  // Para exercícios cardio (corrida, etc.)
  distance?: number;
  distanceUnit?: DistanceUnitEnum;
  pace?: number; // em segundos por km/milha
  averageHeartRate?: number;
  maxHeartRate?: number;

  // Dados de GPS para corrida
  startLocation?: {
    latitude: number;
    longitude: number;
  };
  endLocation?: {
    latitude: number;
    longitude: number;
  };
  routePoints?: Array<{
    latitude: number;
    longitude: number;
    // timestamp: Date;
    // elevation?: number;
    // currentPace?: number;
  }>;

  speedAverage?: number; // em km/h ou milhas/h
  paceAverage?: string; // Formato "mm:ss"

  // Dados de progresso
  perceivedEffort?: number; // Escala de 1-10
  feelingScore?: number; // Como o usuário se sentiu (1-5)

  // Status do exercício
  completed: boolean;
  partiallyCompleted?: boolean;
}
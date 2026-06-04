// src/database/hooks/useDatabase.tsx
import { useMemo } from "react";
import { useRealm } from "@realm/react";
import { AcademyLocalService } from "../services/AcademyLocalService";
import { UserLocalService } from "../services/UserLocalService";
import { ExerciseByUserLocalService } from "../services/ExerciseByUserLocalService";
import { TrainingLocalService } from "../services/TrainingLocalService";
import { ExerciseHistoryLocalService } from "../services/ExerciseHistoryLocalService";
import { TrainingByUserLocalService } from "../services/TrainingByUserService";
import { GroupLocalService } from "../services/GroupLocalService";
import { ExerciseLocalService } from "../services/ExerciseLocalService";
import { GpsMetricsTempLocalService } from "../services/GpsMetricsTempLocalService";

export type LocalDatabaseServices = {
  academyLocalService: AcademyLocalService;
  exerciseLocalService: ExerciseLocalService;
  userLocalService: UserLocalService;
  exerciseByUserLocalService: ExerciseByUserLocalService;
  trainingLocalService: TrainingLocalService;
  exerciseHistoryLocalService: ExerciseHistoryLocalService;
  trainingByUserLocalService: TrainingByUserLocalService;
  groupLocalService?: GroupLocalService;
  gpsMetricsTempLocalService?: GpsMetricsTempLocalService;
};

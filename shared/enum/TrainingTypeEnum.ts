export enum TrainingTypeEnum {
  CARDIO = 'CARDIO',
  BODYBUILDING = 'BODYBUILDING',
  MOBILITY = 'MOBILITY',
  STRETCHING = 'STRETCHING',
  OTHER = 'OTHER',
}

export const trainingType = {
  [TrainingTypeEnum.CARDIO]: 'Cardio',
  [TrainingTypeEnum.BODYBUILDING]: 'Musculação',
  [TrainingTypeEnum.MOBILITY]: 'Mobilidade',
  [TrainingTypeEnum.STRETCHING]: 'Alongamento',
  [TrainingTypeEnum.OTHER]: 'Outro',
}
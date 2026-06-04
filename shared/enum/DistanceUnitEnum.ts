export enum DistanceUnitEnum {
    KILOMETERS = 'KILOMETERS',
    MILES = 'MILES',
    METERS = 'METERS',
    YARDS = 'YARDS',
}

export const DistanceValues = {
    [DistanceUnitEnum.KILOMETERS]: 'kilômetros',
    [DistanceUnitEnum.MILES]: 'milhas',
    [DistanceUnitEnum.METERS]: 'metros',
    [DistanceUnitEnum.YARDS]: 'jardas',
}

export const DistanceUnitAbbreviations = {
    [DistanceUnitEnum.KILOMETERS]: 'KM',
    [DistanceUnitEnum.MILES]: 'mi',
    [DistanceUnitEnum.METERS]: 'm',
    [DistanceUnitEnum.YARDS]: 'yd',
}
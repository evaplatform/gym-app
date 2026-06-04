export function getEnumValue<T extends Record<string, string | number>>(unit: keyof T, enumObj: T): string {
    return enumObj[unit].toString();
};
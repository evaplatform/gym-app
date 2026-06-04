export function hasProperty<T>(obj: any, key: keyof any): obj is T {
  return obj && typeof obj[key] === "string";
}
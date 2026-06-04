export function toPlainObject<T>(realmObject: T | T[] | null | undefined): T | T[] | null {
  if (!realmObject) return null;
  
  if (Array.isArray(realmObject)) {
    return realmObject.map(obj => JSON.parse(JSON.stringify(obj))) as T[];
  }
  
  return JSON.parse(JSON.stringify(realmObject)) as T;
}
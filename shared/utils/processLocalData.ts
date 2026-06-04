import { IDefaultEntityProperties } from "../interfaces/IDefaultEntityProperties";

export function processLocalData<T extends IDefaultEntityProperties>(
  data: T,
  skipJsonSerialization = false
): T {
  const newData = {
    ...data,
    createdAt: data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Date
      ? data.updatedAt
      : data.updatedAt !== undefined
        ? new Date(data.updatedAt)
        : undefined,
    isDeleted: data.isDeleted ?? false,
  } as T & { _id?: string; id?: string };

  if ('_id' in newData) {
    newData.id = (newData?._id as string ?? '');
    delete newData._id;
  }

  const updatedData = Object.keys(newData).reduce((acc, key) => {
    const k = key as keyof T;
    acc[k] = newData[k] === null ? undefined : newData[k] as any;
    return acc;
  }, {} as T & { id?: string });

  // Se skipJsonSerialization for true, não serializa (útil para objetos Realm com embedded objects)
  return skipJsonSerialization ? updatedData : JSON.parse(JSON.stringify(updatedData));
}
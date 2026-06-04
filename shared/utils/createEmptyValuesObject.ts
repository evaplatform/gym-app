export default function createEmptyValuesObject<T>(obj: T) {
    const newObj = {} as T
    for (let key in obj) {
        if (
            obj[key] !== undefined &&
            obj[key] !== null &&
            obj[key] !== '' &&
            !(typeof obj[key] === 'object' && !Array.isArray(obj[key]) && Object.keys(obj[key]).length === 0)
        ) {
            newObj[key] = obj[key];
        }
    }

    return newObj;
}
/**
 * Checks if an object is empty (has no own enumerable properties)
 * @param obj The object to check
 * @returns true if the object is empty, false otherwise
 */
export function isEmptyObject(obj: Record<string, any> | null | undefined): boolean {
    // Check if the object is null or undefined
    if (obj === null || obj === undefined) {
        return true;
    }
    
    // Check if it is actually an object and not an array
    if (typeof obj !== 'object' || Array.isArray(obj)) {
        return false;
    }
    
    // Check if the object has no own enumerable properties
    return Object.keys(obj).length === 0;
}
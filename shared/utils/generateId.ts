/**
 * Generates an ID similar to MongoDB's ObjectID.
 * A MongoDB ObjectID consists of:
 * - timestamp (4 bytes)
 * - machine identifier (3 bytes)
 * - process ID (2 bytes)
 * - counter (3 bytes)
 * 
 * @returns {string} A 24-character hexadecimal string
 */
export function generateId(): string {
    // Timestamp (4 bytes) - seconds since Unix epoch
    const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
    
    // Machine identifier (3 bytes) - random in this case
    const machineId = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    
    // Process ID (2 bytes) - random in this case
    const processId = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
    
    // Counter (3 bytes) - random in this case
    const counter = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    
    // Concatenate all parts to form the 24-character ID
    return timestamp + machineId + processId + counter;
}

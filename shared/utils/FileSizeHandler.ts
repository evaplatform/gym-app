export class FileSizeHandler {
    static calculateBytesFromMB(mb: number): number {
        return mb * 1024 * 1024;
    }

    static getSizeInMB(bytes: number, decimalPlaces = 0): number {
        if (decimalPlaces === 0) {
            return bytes / 1024 / 1024;
        }
        return parseFloat((bytes / 1024 / 1024).toFixed(decimalPlaces));
    }

    static getDurationInMinutes(durationInMinutes:number){
        return durationInMinutes * 60 * 1000;
    }
}

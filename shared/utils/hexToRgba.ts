/**
 * Converts a hexadecimal color to rgba
 * @param hex Color in the format #RRGGBB or #RRGGBBAA
 * @param alpha Transparency (0 to 1), if not provided in the hex
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
    // Remove "#" if it exists
    hex = hex.replace(/^#/, "");
  
    // If it's in short format (#RGB or #RGBA), expand to #RRGGBB[AA]
    if (hex.length === 3) {
      hex = hex.split("").map(c => c + c).join("");
    } else if (hex.length === 4) {
      hex = hex.split("").map(c => c + c).join("");
    }
  
    // Extract components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    // If there is an alpha channel in the hex (#RRGGBBAA)
    if (hex.length === 8) {
      alpha = parseInt(hex.substring(6, 8), 16) / 255;
    }
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

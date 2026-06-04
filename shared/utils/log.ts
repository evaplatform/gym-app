import { LOG } from "../constants/envConstants";

export function log(...messages: any[]): void {
  if (LOG) {
    console.log("[LOG]-", ...messages);
    console.trace();
  }
}

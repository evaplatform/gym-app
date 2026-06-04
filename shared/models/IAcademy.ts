import { IDefaultEntityProperties } from "../interfaces/IDefaultEntityProperties";
import { IImagePathProperty } from "../interfaces/IImagePathProperty";

export interface IAcademy extends IDefaultEntityProperties, IImagePathProperty {
  id: string;
  name: string; // unique
  location: string;
  phoneNumber: string;
  userLimit: number;
}

import { IBodyBuildingByUser } from "./IBodyBuildingByUser";
import { ICardioByUser } from "./ICardioByUser";
import { IPaymentInfo } from "./IPaymentInfo";

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string; // unique
    password?: string;
    profilePhoto?: string;
  
    groupId?: string; // point to group collection
    bodyBuildingByUser?: IBodyBuildingByUser[];
    cardioByUser?: ICardioByUser[];
    academyId?: string;
    paymentInfo?: IPaymentInfo;
    createdAt: Date;
    updatedAt?: Date;
  }
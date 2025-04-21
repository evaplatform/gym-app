import { ISigninCreateRes } from "@/services/LoginServices/types";
import { IUser } from "../interfaces/IUser";

export function assembleUser(userData: ISigninCreateRes): IUser {
    const data: IUser = {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        profilePhoto: userData.profilePhoto,
        groupId: userData.groupId,
        bodyBuildingByUser: userData.bodyBuildingByUser,
        cardioByUser: userData.cardioByUser,
        academyId: userData.academyId,
        paymentInfo: userData.paymentInfo,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
    };

    return data;
}
import { UserWithTokens } from "@/services/AuthServices/types";
import { IUser } from "../models/IUser";

export function assembleUser(userData: UserWithTokens): IUser {
    const data: IUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        profilePhoto: userData.profilePhoto,
        groupIds: userData.groupIds,
        academyId: userData.academyId,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        isAdmin: userData.isAdmin
    };

    return data;
}
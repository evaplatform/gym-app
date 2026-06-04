import { IGoogleTokens } from "@/shared/interfaces/IGoogleTokens";
import { IUser } from "@/shared/models/IUser";
import { ApiRequestType } from "@/shared/types/ApiRequestType";

export type SigninCreateReq = ApiRequestType<IUser> & { token: string, authCode: string }
export type UserWithTokens = IUser & { token: string, googleTokens: IGoogleTokens }
export type RefreshTokenData = {
    token: string;
    googleTokens: IGoogleTokens;
}
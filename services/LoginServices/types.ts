import { IGoogleTokens } from "@/shared/interfaces/IGoogleTokens";
import { IUser } from "@/shared/interfaces/IUser";

export type ISigninCreateReq = Partial<IUser> & { token: string, authCode: string }
export type ISigninCreateRes = IUser & { token: string, googleTokens: IGoogleTokens }
import { post } from "../api";
import { ISigninCreateReq, ISigninCreateRes } from "./types";

export class LoginServices {
    static async createOrLogin(body: ISigninCreateReq) {
        return post<ISigninCreateReq, ISigninCreateRes>('/auth/signin-create', body)
    }
}
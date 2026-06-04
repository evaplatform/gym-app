import { patch, post } from "../api";
import { RefreshTokenData, SigninCreateReq, UserWithTokens } from "./types";

export class AuthServices {
    static async createOrLogin(body: SigninCreateReq) {
        return post<SigninCreateReq, UserWithTokens>('/auth/signin-create', body)
    }

    static async signout() {
        return post('/auth/signout', {})
    }

    static async refreshToken(refreshToken: string) {
        return patch<{ refreshToken: string }, RefreshTokenData>('/auth/refresh-token', { refreshToken })
    }
}
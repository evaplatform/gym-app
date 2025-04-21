import { ISigninCreateReq } from "@/services/LoginServices/types";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const loginUser = async () => {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();

    const { idToken, accessToken } = tokens;
    const authCode = userInfo?.data?.serverAuthCode;

    if (!authCode) {
        throw new Error("authCode is undefined");
    }

    const requestBody: ISigninCreateReq = {
        token: idToken,
        authCode,
        email: userInfo.data?.user.email,
    };

    return requestBody;
}

export { loginUser };
import { StatusCodeEnum } from "@/shared/enum/StatusCodeEnum";
import axios from "axios";

const api = axios.create({ baseURL: "https://gym-api-two.vercel.app/" });

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === StatusCodeEnum.UNAUTHORIZED) {
            // UserService.doLogout()
        }

        if (error?.code === StatusCodeEnum.ERR_NETWORK) {
            // throw new ErrorMessage('Erro', 'Erro desconhecido. Tente novamente.')
        }

        return Promise.reject(error)
    },
)

const get = async <Response>(url: string) => {
    const { data } = await api.get<Response>(url);
    return data;
}

const post = async <Request, Response>(url: string, data: Request) => {
    const response = await api.post<Response>(url, data);
    return response.data;
}
const put = async <Request, Response>(url: string, data: Request) => {
    const response = await api.put<Response>(url, data);
    return response.data;
}

const del = async <Response>(url: string) => {
    const response = await api.delete<Response>(url);
    return response.data;
}
const patch = async <Request, Response>(url: string, data: Request) => {
    const response = await api.patch<Response>(url, data);
    return response.data;
}

export { api, get, post, put, del, patch };
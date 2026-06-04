import { IAcademy } from "@/shared/models/IAcademy";
import { post, get, patch, remove } from "../api";
import { ApiRequestType } from "@/shared/types/ApiRequestType";

export class AcademyServices {
    static async getAll() {
        return get<IAcademy[]>('/academy');
    }

    static async getById(id: string) {
        return get<IAcademy>(`/academy/${id}`);
    }

    static async create(body: ApiRequestType<IAcademy>) {
        return post<ApiRequestType<IAcademy>, IAcademy>('/academy', body)
    }

    static async update(body: ApiRequestType<IAcademy>) {
        return patch<ApiRequestType<IAcademy>, IAcademy>(`/academy`, body);
    }

    static async delete(id: string) {
        const response = await remove<{ message: string }>(`/academy/${id}`);
        return response.message;
    }
}   
import { ITraining } from "@/shared/models/ITraining";
import { post, get, patch, remove } from "../api";
import { ApiRequestType } from "@/shared/types/ApiRequestType";

export class TrainingServices {
    static async getAll() {
        return get<ITraining[]>('/training');
    }

    static async getById(id: string) {
        return get<ITraining>(`/training/${id}`);
    }

    static async create(body: ApiRequestType<ITraining>) {
        return post<ApiRequestType<ITraining>, ITraining>('/training', body)
    }

    static async update(body: ApiRequestType<ITraining>) {
        return patch<ApiRequestType<ITraining>, ITraining>(`/training`, body);
    }

    static async delete(id: string) {
        const response = await remove<{ message: string }>(`/training/${id}`);
        return response.message;
    }

    static async getAllByUserId(userId?: string) {
        if (userId) {
            return get<ITraining[]>(`/training/all-by-user/${userId}`);
        }

        return get<ITraining[]>(`/training/all-by-user`);
    }
}
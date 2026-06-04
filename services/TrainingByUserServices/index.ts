import { ITrainingByUser } from "@/shared/models/ITrainingByUser";
import { post, get, patch, remove } from "../api";
import { ApiRequestType } from "@/shared/types/ApiRequestType";

export class TrainingByUserServices {
    static async getAll() {
        return get<ITrainingByUser[]>('/training-by-user');
    }

    static async getById(id: string) {
        return get<ITrainingByUser>(`/training-by-user/${id}`);
    }

    static async create(body: ApiRequestType<ITrainingByUser>) {
        return post<ApiRequestType<ITrainingByUser>, ITrainingByUser>('/training-by-user', body)
    }

    static async update(body: ApiRequestType<ITrainingByUser>) {
        return patch<ApiRequestType<ITrainingByUser>, ITrainingByUser>(`/training-by-user/${body.id}`, body);
    }

    static async delete(id: string) {
        const response = await remove<{ message: string }>(`/training-by-user/${id}`);
        return response.message;
    }

    static async getByUserId(userId: string) {
        return get<ITrainingByUser[]>(`/training-by-user/get-by-user/${userId}`);
    }
}
import { IExercise } from "@/shared/models/IExercise";
import { post, get, patch, remove } from "../api";
import { ApiRequestType } from "@/shared/types/ApiRequestType";


export class ExerciseServices {
    static async getAll() {
        return get<IExercise[]>('/exercise');
    }

    static async getById(id: string) {
        return get<IExercise>(`/exercise/${id}`);
    }

    static async create(body: ApiRequestType<IExercise>) {
        return post<ApiRequestType<IExercise>, IExercise>('/exercise', body)
    }

    static async update(body: ApiRequestType<IExercise>) {
        return patch<ApiRequestType<IExercise>, IExercise>(`/exercise`, body);
    }

    static async delete(id: string) {
        const response = await remove<{ message: string }>(`/exercise/${id}`);
        return response.message;
    }

    static async getAllByUserId(userId: string) {
        return get<IExercise[]>(`/exercise/${userId}/all-by-user`);
    }

    static async getAllByTrainingId(trainingId: string) {
        return get<IExercise[]>(`/exercise/${trainingId}/all-by-training`);
    }
}   
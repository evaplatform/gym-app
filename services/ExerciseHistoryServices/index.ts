import { IExerciseHistory } from "@/shared/models/IExerciseHistory";
import { get, patch, post, remove } from "../api";
import { ApiRequestType } from "@/shared/types/ApiRequestType";

export class ExerciseHistoryServices {

    static async getAll() {
        return get<IExerciseHistory[]>('/exercise-history');
    }

    static async getById(id: string) {
        return get<IExerciseHistory>(`/exercise-history/${id}`);
    }

    static async create(body: ApiRequestType<IExerciseHistory>) {
        return post<ApiRequestType<IExerciseHistory>, IExerciseHistory>('/exercise-history', body)
    }

    static async update(body: ApiRequestType<IExerciseHistory>) {
        return patch<ApiRequestType<IExerciseHistory>, IExerciseHistory>(`/exercise-history`, body);
    }

    static async delete(id: string) {
        const response = await remove<{ message: string }>(`/exercise-history/${id}`);
        return response.message;
    }

    static async getAllByUserId(userId: string) {
        return get<IExerciseHistory[]>(`/exercise-history/${userId}/all-by-user`);
    }

}
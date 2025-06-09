import { IExercise } from "@/shared/interfaces/IExercise";
import { post, get, patch } from "../api";


export class ExerciseServices {
    static async getAll() {
        return get<IExercise[]>('/exercise');
    }

    static async getById(id: string) {
        return get<IExercise>(`/exercise/${id}`);
    }

    static async create(body: Partial<IExercise>) {
        return post<Partial<IExercise>, Partial<IExercise>>('/exercise', body)
    }

    static async update(body: Partial<IExercise>) {
        return patch<Partial<IExercise>, Partial<IExercise>>(`/exercise`, body);
    }

}
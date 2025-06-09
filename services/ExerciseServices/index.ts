import { IExercise } from "@/shared/interfaces/IExercise";
import { post, get, put } from "../api";


export class ExerciseServices {
    static async getAll() {
        return get<IExercise[]>('/exercise');
    }

    static async create(body: Partial<IExercise>) {
        return post<Partial<IExercise>, Partial<IExercise>>('/exercise', body)
    }

    static async update(body: Partial<IExercise>) {
        return put<Partial<IExercise>, Partial<IExercise>>(`/exercise`, body);
    }

}
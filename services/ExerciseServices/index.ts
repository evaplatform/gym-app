import { IExercise } from "@/shared/interfaces/IExercise";
import { post } from "../api";


export class ExerciseServices {
    static async create(body: Partial<IExercise>) {
        return post<Partial<IExercise>, Partial<IExercise>>('/exercise', body)
    }
}
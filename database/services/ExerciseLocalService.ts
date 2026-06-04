import { IExercise } from '@/shared/models/IExercise';
import { Realm } from '@realm/react';
import { BaseLocalService } from './BaseLocalService';
import { processLocalData } from '@/shared/utils/processLocalData';

export class ExerciseLocalService extends BaseLocalService<IExercise> {
    constructor(realm: Realm) {
        super(realm, 'Exercise');
    }

    getByAcademy(academyId: string): IExercise[] {
        return Array.from(
            this.realm.objects<IExercise>('Exercise')
                .filtered('academyId == $0 AND isDeleted == false', academyId)
                .sorted('name')
        );
    }

    getByTraining(trainingId: string): IExercise[] {
        return Array.from(
            this.realm.objects<IExercise>('Exercise')
                .filtered('trainingIds != null AND ANY trainingIds == $0 AND isDeleted == false', trainingId)
                .sorted('name')
        );
    }

    saveList(exercises: IExercise[]): void {
        this.realm.write(() => {
            exercises.forEach(exerciseByUser => {
                const processedData = processLocalData(exerciseByUser);
                this.realm.create('Exercise', processedData, Realm.UpdateMode.Modified);
            });
        });
    }

    createOrUpdate(exerciseId: string, updateData: Partial<IExercise>): IExercise | null {
        const exercise = this.realm.objectForPrimaryKey<IExercise>('Exercise', exerciseId);

        if (exercise) {
            // Criar uma cópia do updateData sem a propriedade id (chave primária)
            const { id, ...dataWithoutPrimaryKey } = updateData;

            this.realm.write(() => {
                // Agora aplicamos apenas as propriedades que não são a chave primária
                Object.assign(exercise, dataWithoutPrimaryKey);
            });
            return exercise;
        }

        return null;
    }

    resetAll(): void {
        this.realm.write(() => {
            const allExercises = this.realm.objects<IExercise>('Exercise');
            this.realm.delete(allExercises);
        });
    }

    resetAllExercisesMade(): void {
        this.realm.write(() => {
            const allExercises = this.realm.objects<IExercise>('Exercise');
            allExercises.forEach(exercise => {
                exercise.completed = false;
            });
        });
    }
}
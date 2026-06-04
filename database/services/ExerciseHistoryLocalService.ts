import { IExerciseHistory } from '@/shared/models/IExerciseHistory';
import { Realm } from '@realm/react';
import { BaseLocalService } from './BaseLocalService';
import { processLocalData } from '@/shared/utils/processLocalData';

export class ExerciseHistoryLocalService extends BaseLocalService<IExerciseHistory> {
    constructor(realm: Realm) {
        super(realm, 'ExerciseHistory');
    }

    getByAcademy(academyId: string): IExerciseHistory[] {
        return Array.from(
            this.realm.objects<IExerciseHistory>('ExerciseHistory')
                .filtered('academyId == $0 AND isDeleted == false', academyId)
                .sorted('name')
        );
    }

    getByTraining(trainingId: string): IExerciseHistory[] {
        return Array.from(
            this.realm.objects<IExerciseHistory>('ExerciseHistory')
            .filtered('trainingIds != null AND ANY trainingIds == $0 AND isDeleted == false', trainingId)
            .sorted('name')
        );
    }
    saveList(exercises: IExerciseHistory[]): void {
        this.realm.write(() => {
            exercises.forEach(exerciseByUser => {
                const processedData = processLocalData(exerciseByUser);
                this.realm.create('ExerciseHistory', processedData, Realm.UpdateMode.Modified);
            });
        });
    }

    add(exerciseData:  IExerciseHistory): IExerciseHistory | null {
        let newExercise: IExerciseHistory | null = null;
        this.realm.write(() => {
            const processedData = processLocalData(exerciseData);
            newExercise = this.realm.create('ExerciseHistory', processedData);
        });
        return newExercise;
    }

    createOrUpdate(exerciseId: string, updateData: Partial<IExerciseHistory>): IExerciseHistory | null {
        let exercise = this.realm.objectForPrimaryKey<IExerciseHistory>('ExerciseHistory', exerciseId);
        if (exercise) {
            Object.assign(exercise, updateData);
            this.realm.create('ExerciseHistory', exercise, Realm.UpdateMode.Modified);
            return exercise;
        }
        return null;
    }

    resetAll(): void {
        this.realm.write(() => {
            const allExerciseHistories = this.realm.objects<IExerciseHistory>('ExerciseHistory');
            this.realm.delete(allExerciseHistories);
        });
    }
}
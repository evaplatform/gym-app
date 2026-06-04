import { Realm } from '@realm/react';
import { BaseLocalService } from './BaseLocalService';
import { IExerciseByUser } from '@/shared/models/IExerciseByUser';
import { processLocalData } from '@/shared/utils/processLocalData';
import { log } from '@/shared/utils/log';

export class ExerciseByUserLocalService extends BaseLocalService<IExerciseByUser> {
    constructor(realm: Realm) {
        super(realm, 'ExerciseByUser');
    }

    getByName(name: string): IExerciseByUser | null {
        const exercisesByUser = this.realm.objects<IExerciseByUser>('ExerciseByUser')
            .filtered('name == $0 AND isDeleted == false', name);

        return exercisesByUser.length > 0 ? exercisesByUser[0] : null;
    }

    saveList(exercisesByUser: IExerciseByUser[]): void {
        this.realm.write(() => {
            exercisesByUser.forEach(exerciseByUser => {
                const processedData = processLocalData(exerciseByUser);
                this.realm.create('ExerciseByUser', processedData, Realm.UpdateMode.Modified);
            });
        });
    }

    updateExercise(id: string, data: Partial<IExerciseByUser>): IExerciseByUser | null {
        let updatedExerciseByUser: IExerciseByUser | null = null;

        const processedData = processLocalData(data as IExerciseByUser);


        this.realm.write(() => {
            const existingExerciseByUser = this.realm.objectForPrimaryKey<IExerciseByUser>('ExerciseByUser', id);

            if (existingExerciseByUser) {
                Object.keys(processedData).forEach(key => {
                    try {
                        // @ts-ignore
                        existingExerciseByUser[key] = processedData[key];
                    } catch (e) {
                        log(`Error updating key ${key}:`, e);
                    }
                });
                updatedExerciseByUser = existingExerciseByUser;
            }
        });

        return updatedExerciseByUser;
    }

    updateMany(exercisesByUser: Partial<IExerciseByUser>[]): IExerciseByUser[] {

        let updatedExercisesByUser: IExerciseByUser[] = [];

        this.realm.write(() => {
            exercisesByUser.forEach(exerciseByUserData => {
                if (!exerciseByUserData.id) return;

                const existingExerciseByUser = this.realm.objectForPrimaryKey<IExerciseByUser>('ExerciseByUser', exerciseByUserData.id);

                if (existingExerciseByUser) {
                    const processedData = processLocalData(exerciseByUserData as IExerciseByUser);

                    Object.keys(processedData).forEach(key => {
                        try {
                            // @ts-ignore
                            existingExerciseByUser[key] = processedData[key];

                        } catch (e) {
                            log(`Error updating key ${key}:`, e);
                        }
                    });

                    updatedExercisesByUser.push(existingExerciseByUser);
                }
            });
        });
        return updatedExercisesByUser;
    }

    resetAll(): void {
        this.realm.write(() => {
            const allExercisesByUser = this.realm.objects<IExerciseByUser>('ExerciseByUser');
            this.realm.delete(allExercisesByUser);
        });
    }
}
import { Realm } from '@realm/react';
import { BaseLocalService } from './BaseLocalService';
import { processLocalData } from '@/shared/utils/processLocalData';
import { ITraining } from '@/shared/models/ITraining';

export class TrainingLocalService extends BaseLocalService<ITraining> {
    constructor(realm: Realm) {
        super(realm, 'Training');
    }

    getByAcademy(academyId: string): ITraining[] {
        return Array.from(
            this.realm.objects<ITraining>('Training')
                .filtered('academyId == $0 AND isDeleted == false', academyId)
                .sorted('name')
        );
    }

    getByTraining(trainingId: string): ITraining[] {
        return Array.from(
            this.realm.objects<ITraining>('Training')
            .filtered('trainingIds != null AND ANY trainingIds == $0 AND isDeleted == false', trainingId)
            .sorted('name')
        );
    }

    saveList(trainings: ITraining[]): void {
        this.realm.write(() => {
            trainings.forEach(training => {
                const processedData = processLocalData(training);
                this.realm.create('Training', processedData, Realm.UpdateMode.Modified);
            });
        });
    }


    resetAll(): void {
        this.realm.write(() => {
            const allTrainings = this.realm.objects<ITraining>('Training');
            this.realm.delete(allTrainings);
        });
    }
}
import { IGroup } from '@/shared/models/IGroup';
import { Realm } from '@realm/react';
import { BaseLocalService } from './BaseLocalService';
import { processLocalData } from '@/shared/utils/processLocalData';

export class GroupLocalService extends BaseLocalService<IGroup> {
    constructor(realm: Realm) {
        super(realm, 'Group');
    }

    getByAcademy(academyId: string): IGroup[] {
        return Array.from(
            this.realm.objects<IGroup>('Group')
                .filtered('academyId == $0 AND isDeleted == false', academyId)
                .sorted('name')
        );
    }

    saveList(exercises: IGroup[]): void {
        this.realm.write(() => {
            exercises.forEach(exerciseByUser => {
                const processedData = processLocalData(exerciseByUser);
                this.realm.create('Group', processedData, Realm.UpdateMode.Modified);
            });
        });
    }

    createOrUpdate(exerciseId: string, updateData: Partial<IGroup>): IGroup | null {
        const group = this.realm.objectForPrimaryKey<IGroup>('Group', exerciseId);

        if (group) {
            const { id, ...dataWithoutPrimaryKey } = updateData;

            this.realm.write(() => {
                Object.assign(group, dataWithoutPrimaryKey);
            });
            return group;
        }

        return null;
    }

    resetAll(): void {
        this.realm.write(() => {
            const allGroups = this.realm.objects<IGroup>('Group');
            this.realm.delete(allGroups);
        });
    }
}
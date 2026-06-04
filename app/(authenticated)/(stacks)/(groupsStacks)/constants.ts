import { IGroup, IGroupPermissions, PermissionNode } from "@/shared/models/IGroup";
import { ApiRequestType } from "@/shared/types/ApiRequestType";

function createPermissionNode(permitted = false): PermissionNode {
    return { permitted };
}

function createGroupPermissions(permitted = false): IGroupPermissions {
    return {
        changeAcademy: {
            permitted,
        },
        drawerMenu: {
            permitted,
            home: {
                permitted,
                tabs: {
                    home: createPermissionNode(permitted),
                    calendar: createPermissionNode(permitted),
                    exercises: {
                        permitted,
                        finalizeTrainingButton: createPermissionNode(permitted),
                        finalizeExerciseButton: createPermissionNode(permitted),
                        userGpsButton: createPermissionNode(permitted),
                    },
                    cardio: createPermissionNode(permitted),
                    financial: createPermissionNode(permitted),
                    permitted: false
                },
            },
            users: {
                permitted,
                add: createPermissionNode(permitted),
                delete: createPermissionNode(permitted),
                update: createPermissionNode(permitted),
                visualize: createPermissionNode(permitted),
            },
            academies: {
                permitted,
                add: createPermissionNode(permitted),
                delete: createPermissionNode(permitted),
                update: createPermissionNode(permitted),
                visualize: createPermissionNode(permitted),
            },
            exercises: {
                permitted,
                add: createPermissionNode(permitted),
                delete: createPermissionNode(permitted),
                update: createPermissionNode(permitted),
                visualize: createPermissionNode(permitted),
            },
            trainings: {
                permitted,
                add: createPermissionNode(permitted),
                delete: createPermissionNode(permitted),
                update: createPermissionNode(permitted),
                visualize: createPermissionNode(permitted),
            },
            trainingByUserList: {
                permitted,
                add: createPermissionNode(permitted),
                delete: createPermissionNode(permitted),
                update: createPermissionNode(permitted),
                visualize: createPermissionNode(permitted),
            },
            userSettings: {
                permitted,
                resetDataButton: createPermissionNode(permitted),
            },
            charts: {
                permitted,
                deleteHistoryButton: createPermissionNode(permitted),
                deleteAllHistoryButton: createPermissionNode(permitted),
                visualize: createPermissionNode(permitted),
            },
            groups: {
                permitted,
                changeAcademyButton: createPermissionNode(permitted),
                add: createPermissionNode(permitted),
                delete: createPermissionNode(permitted),
                update: createPermissionNode(permitted),
            },
        },
    };
}

export function createMockGroupData(permitted = false): ApiRequestType<IGroup> {
    return {
        name: "group name",
        academyId: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
        permissions: createGroupPermissions(permitted),
    };
}

// Exemplo de uso:
export const INITIAL_GROUP_DATA = createMockGroupData(false);

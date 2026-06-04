import { INITIAL_GROUP_DATA } from "@/app/(authenticated)/(stacks)/(groupsStacks)/constants";
import { IGroup, IGroupPermissions } from "../models/IGroup";

/**
 * @description Unifies multiple groups into a single group with combined permissions. If a group has permission for something, the unified group will also have it
 */
export const unifyGroups = (groups: IGroup[]): IGroupPermissions => {
    if (groups.length === 0) {
        return INITIAL_GROUP_DATA.permissions;
    }

    if (groups.length === 1) {
        return groups[0].permissions;
    }

    // Start with an empty group
    const unifiedGroup: IGroup = JSON.parse(JSON.stringify(INITIAL_GROUP_DATA));

    // Recursive function to merge permission objects
    const mergePermissions = (target: any, source: any) => {
        for (const key in source) {
            if (typeof source[key] === 'object' && source[key] !== null) {
                // Se a chave não existir no alvo, inicialize-a
                if (!target[key] || typeof target[key] !== 'object') {
                    target[key] = {};
                }

                // Se for um nó de permissão com "permitted"
                if ('permitted' in source[key]) {
                    if (!target[key].permitted) {
                        target[key].permitted = source[key].permitted;
                    } else {
                        // Se já tiver permissão, mantenha-a (OR lógico)
                        target[key].permitted = target[key].permitted || source[key].permitted;
                    }
                }

                // Recursivamente mescla propriedades aninhadas
                mergePermissions(target[key], source[key]);
            } else if (key === 'permitted') {
                // Caso especial para a propriedade "permitted" no nível superior
                target[key] = target[key] || source[key];
            }
        }
    };

    // Merge each group into the unified group
    groups.forEach(group => {
        mergePermissions(unifiedGroup.permissions, group.permissions);
    });

    return unifiedGroup.permissions;
};


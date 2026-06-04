import { ItemType } from "@/components/custom/Dropdown";
import { i18n } from '@/i18n'
import { AppMessagesEnum } from "../enum/AppMessagesEnum";


type GenerateDropdownOptionsParams<T> = {
    list: T[] | undefined,
    label?: string,
    value?: string
}

export function generateDropdownOptions<T extends Record<string, any>>({ list, label = "name", value = "id" }: GenerateDropdownOptionsParams<T>): ItemType[] {
    return list
        ? list.reduce((acum, training, index) => {
            if (index === 0) {
                acum.push({
                    label: i18n.translate(AppMessagesEnum.NOT_DEFINED),
                    value: "",
                });
            }
            acum.push({
                label: training[label],
                value: training[value],
            });
            return acum;
        }, [] as { label: string; value: string }[])
        : []
} 
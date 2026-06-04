import { ListItem } from ".";
import { IdType } from "@/shared/interfaces/IdType";

type CreteListTypes = {
  list: ListItem[] | string[] | number[];
  savedIds: IdType[];
  onDelete: (id: string) => void;
};

export function useCreateListItem() {
  const updateItem = (item: ListItem | string | number): ListItem => {
    if (typeof item === "string") {
      return { id: item, name: item };
    }

    if (typeof item === "number") {
      return { id: item.toString(), name: item.toString() };
    }

    return item;
  };

  const createListItem = ({
    list,
    savedIds,
    onDelete,
  }: CreteListTypes): ListItem[] =>
    list.reduce((trainingListAcc, item) => {
      const updatedItem = updateItem(item);

      if (savedIds.includes(updatedItem.id)) {
        trainingListAcc.push({
          id: updatedItem.id,
          name: updatedItem.name,
          onDelete: () => onDelete(updatedItem.id),
        });
      }

      return trainingListAcc;
    }, [] as ListItem[]);

  return { createListItem };
}

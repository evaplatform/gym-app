import { IAcademy } from "@/shared/models/IAcademy";
import { Realm } from "@realm/react";
import { BaseLocalService } from "./BaseLocalService";

export class AcademyLocalService extends BaseLocalService<IAcademy> {
  constructor(realm: Realm) {
    super(realm, "Academy");
  }

  // Métodos específicos para Academy
  getByName(name: string): IAcademy | null {
    const academies = this.realm
      .objects<IAcademy>("Academy")
      .filtered("name == $0 AND isDeleted == false", name);

    return academies.length > 0 ? academies[0] : null;
  }

  resetAll(): void {
    this.realm.write(() => {
      const allAcademies =
        this.realm.objects<IAcademy>("Academy");
      this.realm.delete(allAcademies);
    });
  }
}

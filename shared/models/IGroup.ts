import { AppMessagesEnum } from "../enum/AppMessagesEnum";
import { IDefaultEntityProperties } from "../interfaces/IDefaultEntityProperties";
import { IdType } from "../interfaces/IdType";
import { i18n } from "@/i18n";

export interface PermissionNode {
  permitted: boolean;
}

export interface IGroupPermissions {
  changeAcademy: {
    permitted: boolean;
  };
  drawerMenu: {
    permitted: boolean;
    home: {
      permitted: boolean;
      tabs: {
        permitted: boolean;
        home: PermissionNode;
        calendar: PermissionNode;
        exercises: {
          permitted: boolean;
          finalizeTrainingButton: PermissionNode;
          finalizeExerciseButton: PermissionNode;
          userGpsButton: PermissionNode;
        };
        cardio: PermissionNode;
        financial: PermissionNode;
      };
    };
    users: {
      permitted: boolean;
      visualize: PermissionNode;
      add: PermissionNode;
      delete: PermissionNode;
      update: PermissionNode;
    };
    academies: {
      permitted: boolean;
      visualize: PermissionNode;
      add: PermissionNode;
      delete: PermissionNode;
      update: PermissionNode;
    };
    exercises: {
      permitted: boolean;
      visualize: PermissionNode;
      add: PermissionNode;
      delete: PermissionNode;
      update: PermissionNode;
    };
    trainings: {
      permitted: boolean;
      visualize: PermissionNode;
      add: PermissionNode;
      delete: PermissionNode;
      update: PermissionNode;
    };
    trainingByUserList: {
      permitted: boolean;
      visualize: PermissionNode;
      add: PermissionNode;
      delete: PermissionNode;
      update: PermissionNode;
    };
    userSettings: {
      permitted: boolean;
      resetDataButton: PermissionNode;
    };
    charts: {
      visualize: PermissionNode;
      permitted: boolean;
      deleteHistoryButton: PermissionNode;
      deleteAllHistoryButton: PermissionNode;
    };
    groups: {
      changeAcademyButton: PermissionNode;
      permitted: boolean;
      add: PermissionNode;
      delete: PermissionNode;
      update: PermissionNode;
    };
  };
}

export const getLabelForPermissionKey = (
  t: (code: AppMessagesEnum) => string,
  key: string,
): string => {
  const labelMap: { [key: string]: string } = {
    // Root level permission
    changeAcademy: t(AppMessagesEnum.PERMISSION_CHANGE_ACADEMY),

    // Drawer Menu
    drawerMenu: t(AppMessagesEnum.PERMISSION_DRAWER_MENU),

    // Home
    "drawerMenu.home": t(AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME),

    // Home Tabs
    "drawerMenu.home.tabs": t(AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS),
    "drawerMenu.home.tabs.home": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_HOME,
    ),
    "drawerMenu.home.tabs.calendar": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_CALENDAR,
    ),
    "drawerMenu.home.tabs.exercises": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_EXERCISES,
    ),
    "drawerMenu.home.tabs.exercises.finalizeTrainingButton": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_EXERCISES_FINALIZE_TRAINING_BUTTON,
    ),
    "drawerMenu.home.tabs.exercises.finalizeExerciseButton": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_EXERCISES_FINALIZE_EXERCISE_BUTTON,
    ),
    "drawerMenu.home.tabs.exercises.userGpsButton": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_EXERCISES_USER_GPS_BUTTON,
    ),
    "drawerMenu.home.tabs.cardio": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_CARDIO,
    ),
    "drawerMenu.home.tabs.financial": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_HOME_TABS_FINANCIAL,
    ),

    // Users
    "drawerMenu.users": t(AppMessagesEnum.PERMISSION_DRAWER_MENU_USERS),
    "drawerMenu.users.visualize": t(
      AppMessagesEnum.VISUALIZE,
    ),
    "drawerMenu.users.add": t(AppMessagesEnum.ADD),
    "drawerMenu.users.delete": t(
      AppMessagesEnum.DELETE,
    ),
    "drawerMenu.users.update": t(
      AppMessagesEnum.UPDATE,
    ),

    // Academies
    "drawerMenu.academies": t(AppMessagesEnum.PERMISSION_DRAWER_MENU_ACADEMIES),
    "drawerMenu.academies.visualize": t(
      AppMessagesEnum.VISUALIZE,
    ),
    "drawerMenu.academies.add": t(
      AppMessagesEnum.ADD,
    ),
    "drawerMenu.academies.delete": t(
      AppMessagesEnum.DELETE,
    ),
    "drawerMenu.academies.update": t(
      AppMessagesEnum.UPDATE,
    ),

    // Exercises
    "drawerMenu.exercises": t(AppMessagesEnum.PERMISSION_DRAWER_MENU_EXERCISES),
    "drawerMenu.exercises.visualize": t(
      AppMessagesEnum.VISUALIZE,
    ),
    "drawerMenu.exercises.add": t(
      AppMessagesEnum.ADD,
    ),
    "drawerMenu.exercises.delete": t(
      AppMessagesEnum.DELETE,
    ),
    "drawerMenu.exercises.update": t(
      AppMessagesEnum.UPDATE,
    ),

    // Trainings
    "drawerMenu.trainings": t(AppMessagesEnum.PERMISSION_DRAWER_MENU_TRAININGS),
    "drawerMenu.trainings.visualize": t(
      AppMessagesEnum.VISUALIZE,
    ),
    "drawerMenu.trainings.add": t(
      AppMessagesEnum.ADD,
    ),
    "drawerMenu.trainings.delete": t(
      AppMessagesEnum.DELETE,
    ),
    "drawerMenu.trainings.update": t(
      AppMessagesEnum.UPDATE,
    ),

    // Training By User List
    "drawerMenu.trainingByUserList": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_TRAINING_BY_USER_LIST,
    ),
    "drawerMenu.trainingByUserList.visualize": t(
      AppMessagesEnum.VISUALIZE,
    ),
    "drawerMenu.trainingByUserList.add": t(
      AppMessagesEnum.ADD,
    ),
    "drawerMenu.trainingByUserList.delete": t(
      AppMessagesEnum.DELETE,
    ),
    "drawerMenu.trainingByUserList.update": t(
      AppMessagesEnum.UPDATE,
    ),

    // User Settings
    "drawerMenu.userSettings": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_USER_SETTINGS,
    ),
    "drawerMenu.userSettings.resetDataButton": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_USER_SETTINGS_RESET_DATA_BUTTON,
    ),

    // Charts
    "drawerMenu.charts": t(AppMessagesEnum.PERMISSION_DRAWER_MENU_CHARTS),
    "drawerMenu.charts.visualize": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_CHARTS_VISUALIZE,
    ),
    "drawerMenu.charts.deleteHistoryButton": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_CHARTS_DELETE_HISTORY_BUTTON,
    ),
    "drawerMenu.charts.deleteAllHistoryButton": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_CHARTS_DELETE_ALL_HISTORY_BUTTON,
    ),

    // Groups
    "drawerMenu.groups": t(AppMessagesEnum.PERMISSION_DRAWER_MENU_GROUPS),
    "drawerMenu.groups.changeAcademyButton": t(
      AppMessagesEnum.PERMISSION_DRAWER_MENU_GROUPS_CHANGE_ACADEMY_BUTTON,
    ),
    "drawerMenu.groups.add": t(
      AppMessagesEnum.ADD,
    ),
    "drawerMenu.groups.delete": t(
      AppMessagesEnum.DELETE,
    ),
    "drawerMenu.groups.update": t(
      AppMessagesEnum.UPDATE,
    ),
  };
  return labelMap[key] || key;
};

export interface IGroup extends IDefaultEntityProperties {
  name: string; // unique
  academyId: IdType; // point to academy collection
  permissions: IGroupPermissions;
}

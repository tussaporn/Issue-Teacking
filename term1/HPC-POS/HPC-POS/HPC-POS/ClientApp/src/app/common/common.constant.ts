export const SERVER_PATH: string = "http://localhost:50574/";
//export const SERVER_PATH: string = "/";

export const APPLICATION_VERSION = "1.0.20170626";

export const PAGE_STEP: number = 5;
export const DISPLAY_PAGE: number = 20;
export const OFFSET_SIDEBAR_HEIGHT: number = 84;
export const OFFSET_MENU_ITEM_HOVER: number = 60;
export const DEFAULT_GROUP_CHECKER: number = 3;
export const USER_LOCAL_STORAGE: string = "currentUser";

export const MESSAGE_GLOBAL_KEY: string = "message.dialog";
export const MENU_GLOBAL_COLLAPSED: string = "menu.isCollapsed";
export const MENU_GLOBAL_ACTIVELINK: string = "menu.activeLink";
export const COMMAND_GLOBAL: string = "command";
export const COMMAND_GLOBAL_BACK: string = "command.back";

export const IMAGES_ROOT = "assets/img/";

export const layoutSizes = {
  resWidthCollapseSidebar: 1200,
  resWidthHideSidebar: 500
};
export const layoutPaths = {
  images: {
    root: IMAGES_ROOT,
    profile: IMAGES_ROOT + "app/profile/",
    nationality: IMAGES_ROOT + "app/nationality/",
    amMap: "assets/img/theme/vendor/ammap/",
    amChart: "assets/img/theme/vendor/amcharts/dist/amcharts/images/"
  }
};

export enum MESSAGE_DIALOG_TYPE {
    INFORMATION,
    ERROR,
    WARNING,
    WARNING_QUESTION,
    QUESTION,
    QUESTION_WITH_CANCEL
}
export enum MESSAGE_DIALOG_RETURN_TYPE {
    OK,
    CANCEL,
    YES,
    NO,
    CLOSE
}

export enum CONFIRM_CHANGE_SCREEN {
    CHANGE,
    CONFIRM_UNSAVE
}
export interface ConfirmChangeScreen {
    confirmChange: () => CONFIRM_CHANGE_SCREEN;
    confirmChangeResult: (result: boolean) => void;
}
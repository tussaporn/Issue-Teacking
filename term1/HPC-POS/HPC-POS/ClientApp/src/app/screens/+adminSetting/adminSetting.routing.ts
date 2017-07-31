import { ModuleWithProviders }      from "@angular/core";
import { Routes, RouterModule }     from "@angular/router";

import {
    RoleData,
    ROLE_PERMISSION,
    ConfirmChangeScreenGuard
}                                   from "../../common";

import { AdminSettingGroupComponent }      from "./group/adminSetting.group.component";
import { AdminSettingGroupDetailComponent }      from "./groupDetail/adminSetting.groupDetail.component";
import { AdminSettingPermissionComponent }      from "./permission/adminSetting.permission.component";
import { AdminSettingSelectComponent }      from "./select/adminSetting.select.component";

export const routes: Routes = [
  {
      path: "",
      redirectTo: "s",
      pathMatch: "full"
    },
  {
      path: "s",
      component: AdminSettingSelectComponent,
      data: { "role": new RoleData([
                      { screenID: "SCS020", permissions: [ROLE_PERMISSION.OPEN] },
                      { screenID: "SCS021", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD] }
                    ]) }
  },
  {
    path: "gd",
    component: AdminSettingGroupDetailComponent,
    data: { "role": new RoleData([
                      { screenID: "SCS020", permissions: [ROLE_PERMISSION.OPEN] },
                      { screenID: "SCS021", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD] }
                    ]) }
  },
  {
      path: "g",
      component: AdminSettingGroupComponent,
      data: { "role": new RoleData([
                      { screenID: "SCS020", permissions: [ROLE_PERMISSION.OPEN] },
                      { screenID: "SCS021", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD] }
                    ]) }
  },
  {
      path: "p",
      component: AdminSettingPermissionComponent,
      data: { "role": new RoleData([
                      { screenID: "SCS020", permissions: [ROLE_PERMISSION.OPEN] },
                      { screenID: "SCS021", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD] }
                    ]) }
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

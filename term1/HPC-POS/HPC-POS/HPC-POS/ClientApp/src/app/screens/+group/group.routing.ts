import { ModuleWithProviders }      from "@angular/core";
import { Routes, RouterModule }     from "@angular/router";

import {
    RoleData,
    ROLE_PERMISSION,
    ConfirmChangeScreenGuard
}                                   from "../../common";

import { GroupSearchComponent }     from "./search/group.search.component";
import { GroupDetailComponent }     from "./detail/group.detail.component";

export const routes: Routes = [
  {
      path: "",
      redirectTo: "s",
      pathMatch: "full"
  },
  {
    path: "s",
    component: GroupSearchComponent,
    data: { "role": new RoleData([
                      { screenID: "SCS010", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD, ROLE_PERMISSION.DELETE] },
                      { screenID: "SCS011", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD] }
                    ]) }
  },
  {
    path: "d",
    component: GroupDetailComponent,
    data: { "role": new RoleData([
                      { screenID: "SCS011", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD, ROLE_PERMISSION.EDIT] }
                    ]) },
    canDeactivate: [ConfirmChangeScreenGuard]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

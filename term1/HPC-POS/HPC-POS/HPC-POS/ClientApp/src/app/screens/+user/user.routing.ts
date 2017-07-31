import { ModuleWithProviders }      from "@angular/core";
import { Routes, RouterModule }     from "@angular/router";

import {
    RoleData,
    ROLE_PERMISSION,
    ConfirmChangeScreenGuard
}                                   from "../../common";

import { UserSearchComponent }      from "./search/user.search.component";
import { UserDetailComponent }      from "./detail/user.detail.component";

export const routes: Routes = [
  {
      path: "",
      redirectTo: "s",
      pathMatch: "full"
    },
  {
      path: "s",
      component: UserSearchComponent,
      data: { "role": new RoleData([
                      { screenID: "SCS020", permissions: [ROLE_PERMISSION.OPEN] },
                      { screenID: "SCS021", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD] }
                    ]) }
  },
  {
    path: "d",
    component: UserDetailComponent,
    data: { "role": new RoleData([
                      { screenID: "SCS021", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD, ROLE_PERMISSION.EDIT] }
                    ]) },
    canDeactivate: [ConfirmChangeScreenGuard]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

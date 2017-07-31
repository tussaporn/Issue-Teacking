import { ModuleWithProviders }      from "@angular/core";
import { Routes, RouterModule }     from "@angular/router";

import {
    RoleData,
    ROLE_PERMISSION,
    ConfirmChangeScreenGuard
}                                   from "../../../common";

import { BranchSearchComponent }      from "./search/branch.search.component";
import { BranchDetailComponent }      from "./detail/branch.detail.component";

export const routes: Routes = [
  {
      path: "",
      redirectTo: "s",
      pathMatch: "full"
    },
  {
      path: "s",
      component: BranchSearchComponent,
      data: { "role": new RoleData([
                      { screenID: "MAS020", permissions: [ROLE_PERMISSION.OPEN,ROLE_PERMISSION.DELETE] },
                      { screenID: "MAS021", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD,ROLE_PERMISSION.DELETE] }
                    ]) }
  },
  {
    path: "d",
    component: BranchDetailComponent,
    data: { "role": new RoleData([
                      { screenID: "MAS021", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD, ROLE_PERMISSION.EDIT] }
                    ]) },
    canDeactivate: [ConfirmChangeScreenGuard]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

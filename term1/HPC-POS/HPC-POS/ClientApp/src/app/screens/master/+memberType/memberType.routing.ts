import { ModuleWithProviders }      from "@angular/core";
import { Routes, RouterModule }     from "@angular/router";

import {
    RoleData,
    ROLE_PERMISSION,
    ConfirmChangeScreenGuard
}                                   from "../../../common";

import { MemberTypeSearchComponent }      from "./search/memberType.search.component";
import { MemberTypeDetailComponent }      from "./detail/memberType.detail.component";

export const routes: Routes = [
  {
      path: "",
      redirectTo: "s",
      pathMatch: "full"
    },
  {
      path: "s",
      component: MemberTypeSearchComponent,
      data: { "role": new RoleData([
                      { screenID: "MAS030", permissions: [ROLE_PERMISSION.OPEN,ROLE_PERMISSION.DELETE] },
                      { screenID: "MAS031", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD] }
                    ]) }
  },
  {
    path: "d",
    component: MemberTypeDetailComponent,
    data: { "role": new RoleData([
                      { screenID: "MAS031", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.ADD, ROLE_PERMISSION.EDIT] }
                    ]) },
    canDeactivate: [ConfirmChangeScreenGuard]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

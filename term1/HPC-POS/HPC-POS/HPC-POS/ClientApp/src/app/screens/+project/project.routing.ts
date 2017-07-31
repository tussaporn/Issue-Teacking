import { ModuleWithProviders }      from "@angular/core";
import { Routes, RouterModule }     from "@angular/router";

import {
    RoleData,
    ROLE_PERMISSION,
    ConfirmChangeScreenGuard
}                                   from "../../common";

import { ProjectComponent }      from "./project.component";
import { ProjectDetailsComponent }      from "./project_details/project.details.component";
import { IssueComponent }      from "./issue/issue.component";

export const routes: Routes = [
  {
      path: "",
      redirectTo: "p",
      pathMatch: "full"
    },
  {
      path: "p",
      component: ProjectComponent
  },
  {
      path: "pd",
      component: ProjectDetailsComponent
  },
  {
    path: "issue",
    component: IssueComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

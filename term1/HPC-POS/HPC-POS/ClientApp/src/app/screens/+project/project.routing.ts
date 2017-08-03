import { ModuleWithProviders }      from "@angular/core";
import { Routes, RouterModule }     from "@angular/router";

import {
    RoleData,
    ROLE_PERMISSION,
    ConfirmChangeScreenGuard
}                                   from "../../common";

import { ProjectComponent }             from "./project.component";
import { ProjectDetailsComponent }      from "./project_details/project.details.component";
import { IssueComponent }               from "./issue/issue.component";
import { IssueDetailsComponent }        from "./issue_details/issue.details.component";

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
        path : "issue",
        children : [
        {
                path: "",
                component: IssueComponent,
                pathMatch: "full"
                
        },
        {   
                path : "d",
                component: IssueDetailsComponent
        }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

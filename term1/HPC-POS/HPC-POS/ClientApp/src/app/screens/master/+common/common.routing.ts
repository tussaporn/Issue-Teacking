import {
	ModuleWithProviders
}									from "@angular/core";
import {
	Routes,
	RouterModule
}									from "@angular/router";

import {
	MasterCommonComponent
}									from "./common.component";
import {
    RoleData,
    ROLE_PERMISSION,
    ConfirmChangeScreenGuard
}                                   from "../../../common";

export const routes: Routes = [

	{
      path: "",
      component: MasterCommonComponent,
      data: { "role": new RoleData([
                      { screenID: "MAS010", permissions: [ROLE_PERMISSION.OPEN] }
     //                 { screenID: "SCS021", permissions: [ROLE_PERMISSION.OPEN, ROLE_PERMISSION.EDIT] }
                    ]) }
  }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);

import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { userInfoComponent }                  from "./userinfo.component";

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: "",
    component: userInfoComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

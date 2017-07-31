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

export const routes: Routes = [
	{
		path: "",
		component: MasterCommonComponent
	}
	
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);

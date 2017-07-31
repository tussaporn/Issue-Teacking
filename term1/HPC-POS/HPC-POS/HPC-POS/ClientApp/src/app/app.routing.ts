import { 
	Routes, 
	RouterModule 
}                                   from "@angular/router";
import {
	ModuleWithProviders
}									from "@angular/core";

import { Error404Component }    	from "./screens/+errors/404.component";

export const routes: Routes = [
	{
		path: "404",
		component: Error404Component
	},
	{
		path: "login",
		loadChildren: "app/screens/+login/login.module#LoginModule"
	},
	{
		path: "s",
		loadChildren: "app/screens/screens.module#ScreensModule"
	},
	{
		path: "",
		redirectTo: "s",
		pathMatch: "full"
	},
	{ 
		path: "**", 
		redirectTo: "404"
	}
];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });

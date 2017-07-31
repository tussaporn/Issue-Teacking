import {
	ModuleWithProviders
}									from "@angular/core";
import {
	Routes,
	RouterModule
}									from "@angular/router";

import { 
    AuthGuard, 
    RoleGuard 
}                                   from "../common";

import {
	ScreensComponent
}									from "./screens.component";

export const routes: Routes = [
	{
		path: "",
        component: ScreensComponent,
        children: [
			{
                path: "dashboard",
                loadChildren: "app/screens/+dashboard/dashboard.module#DashboardModule"
            },
            {
                path: "group",
                loadChildren: "app/screens/+group/group.module#GroupModule"
            },
            {
                path: "user",
                loadChildren: "app/screens/+user/user.module#UserModule"
            },
            {
                path: "userinfo",
                loadChildren: "app/screens/+userinfo/userinfo.module#userInfoModule"
            },
            {
                path: "project",
                loadChildren: "app/screens/+project/project.module#ProjectModule"
            },
            {
                path: "master",
                children: [
                    {
                      path: "c",
                      loadChildren: "app/screens/Master/+common/common.module#MasterCommonModule"
                    },{
                      path: "b",
                      loadChildren: "app/screens/Master/+branch/branch.module#MasterBranchModule"
                    },
                    {
                        path: "",
                        redirectTo: "c",
                        pathMatch: "full"
                    }

                ]
            },
			{
                        path: "",
                        redirectTo: "dashboard",
                        pathMatch: "full"
                    }
            
        ],
        canActivate: [ AuthGuard ],
        canActivateChild: [ RoleGuard ]
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);

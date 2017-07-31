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
                path : "master",
                children : [
              {
                     path: "c",
                     loadChildren: "app/screens/master/+common/common.module#MasterCommonModule"
              },
              
            	{
                     path: "",
                     redirectTo: "c",
                     pathMatch: "full"
                },
                {   
                     path : "mt",
                     loadChildren: "app/screens/master/+memberType/memberType.module#MemberTypeModule"
                },
                ]
            },
            {   
                path : "adminSetting",
                loadChildren: "app/screens/+adminSetting/adminSetting.module#AdminSettingModule"
               
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

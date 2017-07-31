import { NgModule }                 from "@angular/core";
import { CommonModule }             from "@angular/common";
import { HttpModule }               from "@angular/http";
import { 
    FormsModule, 
    ReactiveFormsModule 
}                                   from "@angular/forms";

import { CtmModule }                from "../../common";

import { AdminSettingService }              from "./adminSetting.service";

import { AdminSettingGroupComponent }      from "./group/adminSetting.group.component";
import { AdminSettingGroupDetailComponent }      from "./groupDetail/adminSetting.groupDetail.component";
import { AdminSettingPermissionComponent }      from "./permission/adminSetting.permission.component";
import { AdminSettingSelectComponent }      from "./select/adminSetting.select.component";
import { routing }                  from "./adminSetting.routing";

@NgModule({
  imports: [
      HttpModule,
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      routing,

      CtmModule
  ],
  declarations: [
      AdminSettingGroupComponent,
      AdminSettingGroupDetailComponent,
      AdminSettingPermissionComponent,
      AdminSettingSelectComponent
  ],
  providers: [
      AdminSettingService
  ]
})
export class AdminSettingModule {}

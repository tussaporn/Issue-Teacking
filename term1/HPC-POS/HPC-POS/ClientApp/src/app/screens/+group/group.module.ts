import { NgModule }                 from "@angular/core";
import { CommonModule }             from "@angular/common";
import { HttpModule }               from "@angular/http";
import { 
    FormsModule, 
    ReactiveFormsModule 
}                                   from "@angular/forms";

import { CtmModule }                from "../../common";

import { GroupService }             from "./group.service";

import { GroupSearchComponent }     from "./search/group.search.component";
import { GroupDetailComponent }     from "./detail/group.detail.component";
import { routing }                  from "./group.routing";

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
      GroupSearchComponent,
      GroupDetailComponent
  ],
  providers: [
      GroupService
  ]
})
export class GroupModule {}

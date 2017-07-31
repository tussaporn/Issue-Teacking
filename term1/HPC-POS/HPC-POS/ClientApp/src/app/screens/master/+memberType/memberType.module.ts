import { NgModule }                 from "@angular/core";
import { CommonModule }             from "@angular/common";
import { HttpModule }               from "@angular/http";
import { 
    FormsModule, 
    ReactiveFormsModule 
}                                   from "@angular/forms";

import { CtmModule }                from "../../../common";

import { MemberTypeService }              from "./memberType.service";

import { MemberTypeSearchComponent }      from "./search/memberType.search.component";
import { MemberTypeDetailComponent }      from "./detail/memberType.detail.component";
import { routing }                  from "./memberType.routing";

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
      MemberTypeSearchComponent,
      MemberTypeDetailComponent
  ],
  providers: [
      MemberTypeService
  ]
})
export class MemberTypeModule {}

import { NgModule }                 from "@angular/core";
import { CommonModule }             from "@angular/common";
import { HttpModule }               from "@angular/http";
import { 
    FormsModule, 
    ReactiveFormsModule 
}                                   from "@angular/forms";

import { CtmModule }                from "../../../common";

import { BranchService }              from "./branch.service";

import { BranchSearchComponent }      from "./search/branch.search.component";
import { BranchDetailComponent }      from "./detail/branch.detail.component";
import { routing }                  from "./branch.routing";

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
      BranchSearchComponent,
      BranchDetailComponent
  ],
  providers: [
      BranchService
  ]
})
export class MasterBranchModule {}

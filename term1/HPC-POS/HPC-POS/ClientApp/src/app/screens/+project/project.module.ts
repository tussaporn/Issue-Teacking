import { NgModule }                 from "@angular/core";
import { CommonModule }             from "@angular/common";
import { HttpModule }               from "@angular/http";
import { 
    FormsModule, 
    ReactiveFormsModule 
}                                   from "@angular/forms";

import { CtmModule }                from "../../common";

import { ProjectService }              from "./project.service";

import { ProjectComponent }      from "./project.component";
import { ProjectDetailsComponent }      from "./project_details/project.details.component";
import { IssueComponent }      from "./issue/issue.component";
import { IssueDetailsComponent }      from "./issue_details/issue.details.component";

import { routing }                  from "./project.routing";

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
      ProjectComponent,
      ProjectDetailsComponent,
      IssueComponent,
      IssueDetailsComponent
  ],
  providers: [
      ProjectService
  ]
})
export class ProjectModule {}

import { NgModule }                 from "@angular/core";
import { CommonModule }             from "@angular/common";
import { HttpModule }               from "@angular/http";
import { 
    FormsModule, 
    ReactiveFormsModule 
}                                   from "@angular/forms";

import { CtmModule }                from "../../common";

import { UserService }              from "./user.service";

import { UserSearchComponent }      from "./search/user.search.component";
import { UserDetailComponent }      from "./detail/user.detail.component";
import { routing }                  from "./user.routing";

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
      UserSearchComponent,
      UserDetailComponent
  ],
  providers: [
      UserService
  ]
})
export class UserModule {}

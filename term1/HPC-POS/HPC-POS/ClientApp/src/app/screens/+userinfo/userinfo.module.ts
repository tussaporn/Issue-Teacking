import { NgModule }             from "@angular/core";
import { CommonModule }         from "@angular/common";
import { HttpModule }           from "@angular/http";
import {
    FormsModule,
    ReactiveFormsModule
}                               from "@angular/forms";

import {
    CtmModule    
}                               from "../../common";

import { userInfoComponent }       from "./userinfo.component";
import { routing }              from "./userinfo.routing";

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
      
      userInfoComponent
  ],
  providers: [
  ]
})
export class userInfoModule {}

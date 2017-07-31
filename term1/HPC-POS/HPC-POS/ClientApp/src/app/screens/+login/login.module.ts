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

import { 
	LgChangePasswordDialog 
}                               from "./components";

import { LoginComponent }       from "./login.component";
import { routing }              from "./login.routing";

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
	  LgChangePasswordDialog,
      
      LoginComponent
  ],
  providers: [
  ]
})
export class LoginModule {}

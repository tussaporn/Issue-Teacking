import {
	NgModule
}								from "@angular/core";
import {
	CommonModule
}								from "@angular/common";
import {
	HttpModule
}								from "@angular/http";
import { 
    FormsModule, 
    ReactiveFormsModule 
}                               from "@angular/forms";

import {
	CtmModule		
}								from "../../../common"

import {
	MasterCommonComponent
}								from "./common.component";
import {
	routing
}								from "./common.routing";

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
		MasterCommonComponent
	],
	providers: [
	]
})
export class MasterCommonModule {}

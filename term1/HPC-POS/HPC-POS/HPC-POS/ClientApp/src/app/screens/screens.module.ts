import {
	NgModule
}								from "@angular/core";
import {
	CommonModule
}								from "@angular/common";

import {
	ScreensComponent
}								from "./screens.component";
import {
	routing
}								from "./screens.routing";

import { 
    CtmModule 
}                           	from "../common";

@NgModule({
	imports: [
		CommonModule, 
		routing,

		CtmModule
	],
	declarations: [
		ScreensComponent
	]
})
export class ScreensModule {
}

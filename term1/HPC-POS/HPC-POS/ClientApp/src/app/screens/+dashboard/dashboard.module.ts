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
	DashboardComponent
}								from "./dashboard.component";
import {
	routing
}								from "./dashboard.routing";

@NgModule({
	imports: [
		HttpModule,
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		routing
	],
	declarations: [
		DashboardComponent
	],
	providers: [
	]
})
export class DashboardModule {}

import {
	NgModule, 
	ApplicationRef,
	Injectable 
}                                   from "@angular/core";
import {
	BrowserModule
}									from "@angular/platform-browser";
import {
	BrowserAnimationsModule
}									from "@angular/platform-browser/animations";
import { 
	FormsModule, 
	ReactiveFormsModule 
}                                   from "@angular/forms";
import {
	HttpModule,
	BrowserXhr
}									from "@angular/http";
import {
	RouterModule
}									from "@angular/router";
import { 
	removeNgStyles, 
	createNewHosts, 
	createInputTransfer 
}                                   from "@angularclass/hmr";
import {
	NgbModule
}									from "@ng-bootstrap/ng-bootstrap";

import {
	ENV_PROVIDERS
}									from "./environment";

import {
	App
}									from "./app.component";
import { 
  AppState,
  StoreType 
}                                   from "./app.service";
import {
	routing
}									from "./app.routing";
import {
	GlobalState
}									from "./global.state";

import {
	CtmModule,
	AuthGuard,
  	RoleGuard,
  	ConfirmChangeScreenGuard
}									from "./common";

import { 
	Error404Component 
}        							from "./screens/+errors/404.component";

const APP_PROVIDERS = [
	AppState,
	GlobalState,
	AuthGuard,
  	RoleGuard,
  	ConfirmChangeScreenGuard
];

@Injectable()
export class CustomBrowserXhr extends BrowserXhr {
  build(): any {
	let xhr = super.build();
    xhr.withCredentials = true;
    return <any>(xhr);
  }
}

@NgModule({
	bootstrap: [App],
	declarations: [
		App,
		Error404Component
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		routing,

		NgbModule.forRoot(),
		CtmModule.forRoot()
	],
	providers: [
		ENV_PROVIDERS,
		APP_PROVIDERS,
		{
			provide: BrowserXhr,
      		useClass: CustomBrowserXhr
		}
	]
})
export class AppModule {
	constructor(
		public appRef: ApplicationRef,
		public appState: AppState
	) {
	}

	hmrOnInit(store: StoreType) {
		if (!store || !store.state) return;

		console.log("HMR store", JSON.stringify(store, null, 2));
		// set state
		this.appState._state = store.state;

		// set input values
		if ("restoreInputValues" in store) {
		  let restoreInputValues = store.restoreInputValues;
		  setTimeout(restoreInputValues);
		}

		this.appRef.tick();
		delete store.state;
		delete store.restoreInputValues;
	}
	hmrOnDestroy(store: StoreType) {
		const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
		// save state
		const state = this.appState._state;
		store.state = state;
		// recreate root elements
		store.disposeOldHosts = createNewHosts(cmpLocation);
		// save input values
		store.restoreInputValues = createInputTransfer();
		// remove styles
		removeNgStyles();
	}
	hmrAfterDestroy(store: StoreType) {
		// display new elements
		store.disposeOldHosts();
		delete store.disposeOldHosts;
	}
}

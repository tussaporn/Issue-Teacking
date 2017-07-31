import { 
	Component, 
	ViewContainerRef
}									from "@angular/core";
import {
	GlobalState
}									from "./global.state";

import {
  BaThemePreloader,
  BaThemeSpinner,
  ApiService,
  CtmTranslateService,
  MENU_GLOBAL_COLLAPSED
}                                 	from "./common";

import "style-loader!./app.scss";
import "style-loader!./common/style/initial.scss";

@Component({
  selector: "app",
  templateUrl: "./app.component.html"
})
export class App {
	private isMenuCollapsed: boolean = true;

	constructor(
		private spinner: BaThemeSpinner,
		private api: ApiService,
		private global: GlobalState,
		private translate: CtmTranslateService
	) {
		this.initLanguage();

		this.global.subscribe(MENU_GLOBAL_COLLAPSED, (isCollapsed) => {
			this.isMenuCollapsed = isCollapsed;
		});
    }

	public ngAfterViewInit(): void {
		// hide spinner once all loaders are completed
		BaThemePreloader.load().then((values) => {  
      this.spinner.hide(500);
		});
	}

	private initLanguage(): void {
      BaThemePreloader.registerLoader(new Promise((resolve) => {
        this.api.callApiController("api/Common/GetCurrentLanguage", {
              type: "POST"
          }).then(
            (result) => {
              this.translate.use(result as string);
              
              this.translate.initialResource()
                .then(() => {
                  resolve();
                });
          });
      }));
  }
}

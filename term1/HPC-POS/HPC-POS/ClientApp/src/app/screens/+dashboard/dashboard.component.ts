import { 
    Component, 
    ViewChild 
}                                       from "@angular/core";
import {
    Router,
    ActivatedRoute
}                                       from "@angular/router";
import { 
    FormBuilder, 
    Validators 
}                                       from "@angular/forms";

import {
    ABaseComponent,
    BaThemeSpinner,
    ApiService,
    CtmScreenCommand,
    CtmTranslateService,
    CtmMessageService,
    CtmCommandService,
    CtmTableService,
    CtmTableData,
    CtmControlManagement,
    MESSAGE_DIALOG_TYPE,
    MESSAGE_DIALOG_RETURN_TYPE,
    DEFAULT_GROUP_CHECKER    
}                                       from "../../common";

import "style-loader!./dashboard.scss";

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent extends ABaseComponent {
	constructor(
        router: Router,
        route: ActivatedRoute,
        spinner: BaThemeSpinner,
        translate: CtmTranslateService,
        message: CtmMessageService,
        command: CtmCommandService,

        private api: ApiService
    ) {
        super(router, route, spinner, translate, message, command, { });
    }

    screenCommand = null;
  screenChanged: boolean = false;

  initScreen(): Promise<Object> {
      this.api.callApiController("api/POS/GetSmallMasterAutoComplete", {
                        type: "POST"
                    }).then(
                        (result) => {
                            this.lists = result as Array<Object>;
                        }
                    );
      return;
  }
  resetChanged() { }

  lists: Array<Object> = [];


}

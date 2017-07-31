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
    MESSAGE_DIALOG_RETURN_TYPE    
}                                       from "../../common";

@Component({
  selector: "error-404",
  templateUrl: "./404.component.html",
})
export class Error404Component extends ABaseComponent {
    constructor(
      router: Router,
      route: ActivatedRoute,
      spinner: BaThemeSpinner,
      translate: CtmTranslateService,
      message: CtmMessageService,
      command: CtmCommandService
      
    ) {
        super(router, route, spinner, translate, message, command, { });
    }
    
    screenCommand = null;
    screenChanged: boolean = false;

    initScreen(): Promise<Object> {
        return;
    }
    resetChanged() { }
}

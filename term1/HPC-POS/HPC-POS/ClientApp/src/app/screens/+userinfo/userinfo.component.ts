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
    ROLE_PERMISSION_TABLE    
}                                       from "../../common";

import "style-loader!./userinfo.component.scss";

@Component({
  selector: "user-info",
  templateUrl: "./userinfo.component.html"  
})
export class userInfoComponent extends ABaseComponent {
    
    @ViewChild(CtmScreenCommand) commandCtrl: CtmScreenCommand;
    constructor(
        router: Router,
        route: ActivatedRoute,
        spinner: BaThemeSpinner,
        translate: CtmTranslateService,
        message: CtmMessageService,
        command: CtmCommandService,

        private fb: FormBuilder,
        private api: ApiService,
        private table: CtmTableService
    ) {
        super(router, route, spinner, translate, message, command, {
         
            commandMgr: {
            }   
        });

        
    }


    initScreen(): Promise<Object> {
        
        return;
    }
    get screenCommand() { return this.commandCtrl; }
     screenChanged: boolean = false;
  resetChanged() { }
}

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


import { ProjectService }                 from "../project.service";

import "style-loader!./project.component.scss";

@Component({
  selector: "project",
  templateUrl: "./project.component.html"  
})
export class ProjectComponent extends ABaseComponent {
    @ViewChild(CtmScreenCommand) commandCtrl: CtmScreenCommand;
    private resultData: CtmTableData;

    constructor(
        router: Router,
        route: ActivatedRoute,
        spinner: BaThemeSpinner,
        translate: CtmTranslateService,
        message: CtmMessageService,
        command: CtmCommandService,
        
//screenParam: ProjectService,

        private fb: FormBuilder,
        private api: ApiService,
        private table: CtmTableService
    ) {
          super(router, route, spinner, translate, message, command, {
            // screenParam: screenParam,
            commandMgr: {
                addCommand: true
            }            
        });

       this.resultData = new CtmTableData(table,4, "");
        
    }


    initScreen(): Promise<Object> {
        return;
    }
    get screenCommand() { return this.commandCtrl; }
     screenChanged: boolean = false;
    resetChanged() { }

    ClickIssue(){
        this.router.navigate(["/s/project/issue"]);
    }

    ClickDetail(){
        this.router.navigate(["/s/project/pd"]);
    }

    ClickReport(){
        this.router.navigate(["/s/project/pd"]);
    }

    NewProject(){
        this.router.navigate(["/s/project/pd"]);
    }
    


}

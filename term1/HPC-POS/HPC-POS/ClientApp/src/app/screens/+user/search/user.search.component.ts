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
}                                       from "../../../common";
import { UserService }                 from "../user.service";

import "style-loader!./user.search.component.scss";

@Component({
  selector: "user-search",
  templateUrl: "./user.search.component.html"  
})
export class UserSearchComponent extends ABaseComponent {
    @ViewChild(CtmScreenCommand) commandCtrl: CtmScreenCommand;
    
    private criteriaCtrlMgr: CtmControlManagement;
    private resultData: CtmTableData;
    
    constructor(
        router: Router,
        route: ActivatedRoute,
        spinner: BaThemeSpinner,
        translate: CtmTranslateService,
        message: CtmMessageService,
        command: CtmCommandService,
        screenParam: UserService,

        private fb: FormBuilder,
        private api: ApiService,
        private table: CtmTableService
    ) {
        super(router, route, spinner, translate, message, command, {
            screenParam: screenParam,
            commandMgr: {
                addCommand: true
            }            
        });

        this.screenParam.newData = false;
        this.screenParam.userName = null;

        this.criteriaCtrlMgr = new CtmControlManagement(
            fb.group({
                "UserName": [null],
                "GroupID": [null],
                "FlagActive": [true]
            }), {
                translate: translate,
                screen: "SCS020",
                mapping: null
            }
        );

        this.resultData = new CtmTableData(table, 7, "api/SCS020/GetUserList");
    }

    get screenCommand() { return this.commandCtrl; }
    screenChanged: boolean = false;

    initScreen(): Promise<Object> {
        if (this.screenParam.criteria != undefined) {
            this.criteriaCtrlMgr.data = this.screenParam.criteria;
            return this.resultData.loadData(this.screenParam.criteria);
        }
        
        this.screenParam.criteria = null;
        return;
    }
    resetChanged() { }

    onAddCommand() {
        this.screenParam.newData = true; 
        this.screenParam.criteria = this.resultData.criteria;
           
        this.router.navigate(["/s/user/d"]);
    }

    private onSearch() {
      let criteria = this.criteriaCtrlMgr.data;
      
      this.resultData.loadData(criteria);
    }
    private onClearSearch() {
      this.screenParam.criteria = null;
      this.criteriaCtrlMgr.clear({
          "FlagActive": true
      });

      this.resultData.clearData();
    }

    private onSelectRow(row) {
        this.screenParam.userName = row.UserName;
        this.screenParam.criteria = this.resultData.criteria;

        this.router.navigate(["/s/user/d"]);
        return false;
    }

    private groupName(grp) {
        if (this.translate.isLanguageEN == true) {
            return grp.GroupNameEN;
        }

        return grp.GroupNameLC;
    }
}

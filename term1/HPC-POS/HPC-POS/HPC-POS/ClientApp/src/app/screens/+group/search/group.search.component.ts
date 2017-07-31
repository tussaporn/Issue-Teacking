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
import { GroupService }                 from "../group.service";

import "style-loader!./group.search.component.scss";

@Component({
  selector: "group-search",
  templateUrl: "./group.search.component.html"  
})
export class GroupSearchComponent extends ABaseComponent {
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
        screenParam: GroupService,

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
        this.screenParam.groupID = null;

        this.criteriaCtrlMgr = new CtmControlManagement(
            fb.group({
                "GroupName": [null],
                "Description": [null],
                "UserName": [null],
                "FlagActive": [true]
            }), {
                translate: translate,
                screen: "SCS010",
                mapping: null
            }
        );

        this.resultData = new CtmTableData(table, 6, "api/SCS010/GetUserGroupList");
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
          
        this.router.navigate(["/s/group/d"]);
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
        this.screenParam.groupID = row.GroupID;
        this.screenParam.criteria = this.resultData.criteria;
      
        this.router.navigate(["/s/group/d"]);
        return false;
    }
    private onDeleteRow(row) {
        this.message.openMessageDialog(
            this.translate.instant("CLC005", "MESSAGE"),
            MESSAGE_DIALOG_TYPE.QUESTION
        ).then((type: MESSAGE_DIALOG_RETURN_TYPE) => {
            if (type == MESSAGE_DIALOG_RETURN_TYPE.YES) {
                this.api.callApiController("api/SCS010/DeleteUserGroup", {
                    type: "POST",
                    data: {
                            GroupID: row.GroupID
                    }
                }).then(
                    data => {
                        if (data == true) {
                            this.resultData.refresh()
                        }
                    }
                );
            }
        });

        return false;
    }   

    private groupName(row) {
        if (this.translate.isLanguageEN == true) {
            return row.NameEN;
        }

        return row.NameLC;
    } 
    private isCurrentGroup(row) {
        if (this.currentUser.groupID == row.GroupID) {
            return true;
        }

        return false;
    }
}

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
}                                       from "../../../../common";
import { BranchService }                 from "../branch.service";

import "style-loader!./branch.search.component.scss";

@Component({
  selector: "branch-search",
  templateUrl: "./branch.search.component.html"  
})
export class BranchSearchComponent extends ABaseComponent {
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
        screenParam: BranchService,

        private fb: FormBuilder,
        private api: ApiService,
        private table: CtmTableService
    ) {
        super(router, route, spinner, translate, message, command, {
            screenParam: screenParam    ,
            commandMgr: {
                addCommand: true
            }   
        });

        this.screenParam.newData = false;
        this.screenParam.BranchID = null;

        this.criteriaCtrlMgr = new CtmControlManagement(
            fb.group({
                "BrandCode": [null],
                "BranchName": [null]
            }), {
                translate: translate,
                screen: "MAS020",
                mapping: null
            }
        );
        
            this.resultData = new CtmTableData(table, 7, "api/master/GetBranchList");
        
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
        this.screenParam.BranchID = null;
        this.screenParam.criteria = this.resultData.criteria;
        this.router.navigate(["/s/master/b/d"]);
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
        this.screenParam.BranchID = row.BranchID;
        this.screenParam.criteria = this.resultData.criteria;
        //console.log(this.screenParam);
        this.router.navigate(["/s/master/b/d"]);
        return false;
    }
    private onDeleteRow(row){
        this.message.openMessageDialog(
            this.translate.instant("CLC005", "MESSAGE"),
            MESSAGE_DIALOG_TYPE.QUESTION
        ).then((type: MESSAGE_DIALOG_RETURN_TYPE) => {
            if (type == MESSAGE_DIALOG_RETURN_TYPE.YES) {
                this.api.callApiController("api/master/DeleteBranch", {
                    type: "POST",
                    data: {
                            BranchID: row.BranchID
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
}

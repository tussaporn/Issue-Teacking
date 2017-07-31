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
}                                       from "../../../../common";
import { MemberTypeService }                 from "../memberType.service";

import "style-loader!./memberType.search.component.scss";

@Component({
  selector: "memberType-search",
  templateUrl: "./memberType.search.component.html"  
})
export class MemberTypeSearchComponent extends ABaseComponent {
    @ViewChild(CtmScreenCommand) commandCtrl: CtmScreenCommand;
    
    private criteriaCtrlMgr: CtmControlManagement;
    private resultData: CtmTableData;
    public HPC : Array<boolean> = [];
    public HPCJ : Array<boolean> = [];
    public PPY : Array<boolean> = [];

    constructor(
        router: Router,
        route: ActivatedRoute,
        spinner: BaThemeSpinner,
        translate: CtmTranslateService,
        message: CtmMessageService,
        command: CtmCommandService,
        screenParam: MemberTypeService,

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
        this.screenParam.MemberTypeID = null;

        this.criteriaCtrlMgr = new CtmControlManagement(
            fb.group({
                "MemberTypeName": [null],
                "ValueCode": [null],
                "DiscountValue": [null],
                "FlagActive": [true]
            }), {
                translate: translate,
                screen: "MAS030",
                mapping: null
            }
        );

        this.resultData = new CtmTableData(table, 13, "api/master/GetMemberList");
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
           
        this.router.navigate(["/s/master/mt/d"]);
    }

    private onSearch() {
      let criteria = this.criteriaCtrlMgr.data;
      this.resultData.loadData(criteria).then(() => {
           this.checkBrandList()
       });
    }
    private checkBrandList() {
       for (let i in this.resultData.rows) {
           this.HPC[i] = false;
           this.HPCJ[i] = false;
           this.PPY[i] = false;
           if (this.resultData.rows[i]["BrandList"] != null) {
               var ch = this.resultData.rows[i]["BrandList"].split(",");
               for (let j of ch) {
                   if (j == "HPC")
                       this.HPC[i] = true;
                   else if (j == "HPCJ")
                       this.HPCJ[i] = true;
                   else if (j == "PPY")
                       this.PPY[i] = true;
               }
           }

       }
   }

    private onClearSearch() {
      this.screenParam.criteria = null;
      this.criteriaCtrlMgr.clear({
          "FlagActive": true
      });

      this.resultData.clearData();
    }

    private onSelectRow(row) {
        this.screenParam.MemberTypeID = row.MemberTypeID;
        this.screenParam.criteria = this.resultData.criteria;
        this.router.navigate(["/s/master/mt/d"]);
        return false;
    }

    private groupName(grp) {
        if (this.translate.isLanguageEN == true) {
            return grp.GroupNameEN;
        }

        return grp.GroupNameLC;
    }

    private onDeleteRow(row) {
        this.message.openMessageDialog(
            this.translate.instant("CLC005", "MESSAGE"),
            MESSAGE_DIALOG_TYPE.QUESTION
        ).then((type: MESSAGE_DIALOG_RETURN_TYPE) => {
            if (type == MESSAGE_DIALOG_RETURN_TYPE.YES) {
                this.api.callApiController("api/Master/DeleteMemberTypeList", {
                    type: "POST",
                    data: {
                            MemberTypeID: row.MemberTypeID
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

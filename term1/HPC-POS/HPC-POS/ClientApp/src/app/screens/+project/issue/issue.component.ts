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
    CtmTextbox,
    CtmControlManagement,
    Md2Autocomplete,
    ConfirmChangeScreen,
    CONFIRM_CHANGE_SCREEN,
    ROLE_PERMISSION_TABLE,
    MESSAGE_DIALOG_TYPE,
    MESSAGE_DIALOG_RETURN_TYPE,
    DEFAULT_GROUP_CHECKER
}                                       from "../../../common";
import { ProjectService }                 from "../project.service";

import "style-loader!./issue.component.scss";
 
@Component({
  selector: "issue",
  templateUrl: "./issue.component.html"  
})
export class IssueComponent extends ABaseComponent implements ConfirmChangeScreen {
    @ViewChild(CtmScreenCommand) commandCtrl: CtmScreenCommand;

    private ctrlMgr: CtmControlManagement;
    private ctrlMgr2: CtmControlManagement;
    private controlDisabled: boolean = true;
    private tmpUserName: string;
    private resultData: CtmTableData;

    

    constructor(
        router: Router,
        route: ActivatedRoute,
        spinner: BaThemeSpinner,
        translate: CtmTranslateService,
        message: CtmMessageService,
        command: CtmCommandService,
        screenParam: ProjectService,

        private fb: FormBuilder,
        private api: ApiService,
        private table: CtmTableService
  ) {
      super(router, route, spinner, translate, message, command, {
            // root: "/s/project/p",
            screenParam: screenParam,
            commandMgr: {
                // addCommand: true,
                editCommand: true,
                updateCommand: true,
                cancelCommand: true,
                backUrl: "/s/project/p"
            }            
        });  
        
       this.resultData = new CtmTableData(table,4, "");
       
         
        
  }
  private priority={
      1:'A',
      2:'B',
      3:'C',
      4:'D',
      5:'E',
  }
  private phase={
      1:'open',
      2:'plan',
      3:'process',
      4:'fix',
      5:'close',
      6:'miss',
      7:'cancel',
      8:'re-debug'
  }
  get screenCommand() { return this.commandCtrl; }
  get screenChanged() : boolean {
    return this.ctrlMgr.changed == true;
  }
  
  initScreen(): Promise<Object> {
    return ;     
  }
  resetChanged() {
    this.ctrlMgr.resetChanged();
  }

  public confirmChange(): CONFIRM_CHANGE_SCREEN {
    return this.screenChanged ? CONFIRM_CHANGE_SCREEN.CONFIRM_UNSAVE : CONFIRM_CHANGE_SCREEN.CHANGE;
  }
  public confirmChangeResult(result: boolean) {
    if (result == true) {
      this.screenParam.BranchName = null;
    }
  }

    ClickDetails(){
        this.router.navigate(["/s/project/issue/d"]);
    }
    
    ClickModal(row){
        for(var i=1;i<5;i++){
            if(row==this.priority[i]){
        $('.to_status').html(this.priority[i+1]);
            }
        }
        $('.from_status').html(row);
    }

    NewIssue(){
        this.router.navigate(["/s/project/issue/d"]);

    }
}

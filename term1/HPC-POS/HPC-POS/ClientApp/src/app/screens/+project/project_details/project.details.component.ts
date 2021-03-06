﻿import { 
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

import "style-loader!./project.details.component.scss";
 
@Component({
  selector: "project-details",
  templateUrl: "./project.details.component.html"  
})
export class ProjectDetailsComponent extends ABaseComponent implements ConfirmChangeScreen {
    @ViewChild(CtmScreenCommand) commandCtrl: CtmScreenCommand;
    // @ViewChild("BranchID") BranchID: CtmTextbox;
	  @ViewChild("BrandCode") BrandCode: Md2Autocomplete;
	  @ViewChild("ProvinceID") ProvinceID: Md2Autocomplete;

    private ctrlMgr: CtmControlManagement;
    private ctrlMgr2: CtmControlManagement;
    private controlDisabled: boolean = true;
    private tmpUserName: string;
    private resultData: CtmTableData;
    private checker = [
  
      new checkers('1','')
  ];
    private newInfo = [
  
      new checkers('','')
  ];
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
            //root: "/s/master/b/s",
            screenParam: screenParam,
            commandMgr: {
            }            
        });  

      
         
       
        
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
   
  }

  InsertChecker(){
        $("#checker_first").clone().appendTo('#checker_data');
  }
    
  InsertMember(){
        $("#member_first").clone().appendTo('#member_data');
  }

  DeleteChecker(){
       if($(".checker_data").length>1)
            // $(".checker_data").last().remove();
            $('.btn_delete').parent().parent().remove();
  }

   DeleteMember(){
       if($(".member_data").length>1)
            $(".member_data").last().remove();
  }
    



   

  
  addInfo(newInfo:any) {
      console.log(this.checker);
     
    if (newInfo) {
        this.checker.push(new checkers( $('.checker_data').length+1,newInfo.priority));
    }
  }
    onKey(event:any) { // without type info
    return event.target.value;
  }
    onClickRemove(index)
    {
        console.log(index);
    //Replace your model here 
    this.checker.splice(index-1, 1);
    }
}
class checkers {
constructor(
    public user ,
    public priority:string) { }
}
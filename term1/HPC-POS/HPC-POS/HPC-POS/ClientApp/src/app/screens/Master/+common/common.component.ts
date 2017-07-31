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
}                                       from "../../../common";

import "style-loader!./common.scss";

@Component({
  selector: "master-common",
  templateUrl: "./common.component.html"
})
export class MasterCommonComponent extends ABaseComponent {
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


        private fb: FormBuilder,
        private api: ApiService,
        private table: CtmTableService
    ) {
        super(router, route, spinner, translate, message, command, {       
            commandMgr: {
                addCommand: true,
                editCommand: true,
                updateCommand: true,
                cancelCommand: true,
                // backUrl: "/s/group/s"
            } 
        });
        this.criteriaCtrlMgr = new CtmControlManagement(
            fb.group({
                "MSTCode": [null]
            })
        );

         this.resultData = new CtmTableData(table, 6, "api/master/GetSmallMasterDetails");

    }
    get screenCommand() { return this.commandCtrl; }
    screenChanged: boolean = false;


    headTable = {
                            Value1Description:null,
                            Value2Description:null,
                            Value3Description:null
                        };
    codeComand:boolean = false;

  initScreen(): Promise<Object> {
        this.commandCtrl.useEditCommand = true; // show edit btn
        this.commandCtrl.editCommandDisabled = false; // disabled edit btn
        this.Thead();
        return;
  }
  
  private onChangeAuto(){
     
      let criteria = this.criteriaCtrlMgr.data;
       this.Thead();
      return this.resultData.loadData(criteria);
  }

  private Thead(){
      if(this.criteriaCtrlMgr.data.MSTCode!=null){
      this.api.callApiController("api/master/GetSmallMasterDescription", {
            type:"POST",
            data:this.criteriaCtrlMgr.data
            
        }).then(
            (result) => {
                if(this.translate.isLanguageEN==true){
                    this.headTable.Value1Description = result.Value1DescriptionEN; 
                    this.headTable.Value2Description = result.Value2DescriptionEN; 
                    this.headTable.Value3Description = result.Value3DescriptionEN; 
                }else{
                    this.headTable.Value1Description = result.Value1DescriptionLC; 
                    this.headTable.Value2Description = result.Value2DescriptionLC; 
                    this.headTable.Value3Description = result.Value3DescriptionLC; 

                }
            }
        );  
        
        console.log(this.headTable);
      }
      
  }
  onEditCommand(){
        this.codeComand = true;
        this.commandCtrl.editCommandDisabled = true; // disabled edit btn
        this.commandCtrl.useCancelCommand = true;
        this.commandCtrl.cancelCommandDisabled = false; // disabled edit btn
  }
   onCancelCommand(){
        this.codeComand = false;
        this.commandCtrl.editCommandDisabled = false; // disabled edit btn
        this.commandCtrl.useCancelCommand = false;
        this.commandCtrl.cancelCommandDisabled = true; // disabled edit btn
  }
  resetChanged() { }
}

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
}                                       from "../../../../common";
import { MemberTypeService }                 from "../memberType.service";

import "style-loader!./memberType.detail.component.scss";

@Component({
  selector: "memberType-detail",
  templateUrl: "./memberType.detail.component.html"  
})
export class MemberTypeDetailComponent extends ABaseComponent implements ConfirmChangeScreen {
    @ViewChild(CtmScreenCommand) commandCtrl: CtmScreenCommand;
    @ViewChild("memberTypeName") memberTypeName: CtmTextbox;
	  @ViewChild("groupID") groupID: Md2Autocomplete;

    private ctrlMgr: CtmControlManagement;
    private controlDisabled: boolean = true;
    private tmpUserName: string;
    public flagDay : boolean = false;
    public flagMonth : boolean = false;
    public flagYear : boolean = false;
    public HPC : boolean = false;
    public HPCJ : boolean = false;
    public PPY : boolean = false;
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
            root: "/s/master/mt/d",
            screenParam: screenParam,
            commandMgr: {
                
                editCommand: true,
                updateCommand: true,
                cancelCommand: true,
                backUrl: "/s/master/mt/s"
            }            
        });  

        this.ctrlMgr = new CtmControlManagement(
            fb.group({
                "MemberTypeName": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "CashDiscountType": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "CashDiscountValue": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "CreditDiscountValue": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "CreditDiscountType": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "MemberLifeType": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "Lifetime": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "StartPeriod": [{value: null, disabled: true }],
                "EndPeriod": [{value: null, disabled: true }],
                "Remark": [{value: null, disabled: true }],
                "FlagActive": [{value: true, disabled: true }, Validators.compose([Validators.required])],
                "CheckBrandList":[null],
                "HPC_chk":[null],
                "HPCJ_chk":[null],
                "PPY_chk":[null]
            }), {
                translate: translate,
                screen: "MAS031",
                mapping: {
                  "MemberTypeName": "memberTypeName",
                  "CashDiscountType": "cashDiscountType",
                  "CashDiscountValue": "cashDiscountValue",
                  "CreditDiscountValue": "creditDiscountValue",
                  "CreditDiscountType": "creditDiscountType",
                  "MemberLifeType": "memberLifeType",
                  "Lifetime":"lifetime",
                  "StartPeriod": "startPeriod",
                  "EndPeriod": "endPeriod",
                  "Remark": "remark",
                  "FlagActive": "flagActive"
               }
            }
        );
  }

  get screenCommand() { return this.commandCtrl; }
  get screenChanged() : boolean {
    return this.ctrlMgr.changed == true;
  }
  
  initScreen(): Promise<Object> {
      // this.api.callApiController("api/Master/GetMemberType", {
      //                   type: "POST",
      //                   data: {
      //                       MemberTypeID: this.screenParam.MemberTypeID
      //                   }
      //               }).then(
      //                 (result) => {
      //                   //list 
      //               });
    return this.loadData();     
  }
  resetChanged() {
    this.ctrlMgr.resetChanged();
  }

  public confirmChange(): CONFIRM_CHANGE_SCREEN {
    return this.screenChanged ? CONFIRM_CHANGE_SCREEN.CONFIRM_UNSAVE : CONFIRM_CHANGE_SCREEN.CHANGE;
  }
  public confirmChangeResult(result: boolean) {
    if (result == true) {
      this.screenParam.userName = null;
    }
  }

  onAddCommand() {
    this.tmpUserName = this.screenParam.userName;
    this.screenParam.newData = true;
    this.screenParam.userName = null;

    this.commandCtrl.editCommandDisabled = true;
    this.commandCtrl.updateCommandDisabled = false;
    this.commandCtrl.cancelCommandDisabled = false;

    this.loadData();
  }
  onEditCommand() {
    this.commandCtrl.editCommandDisabled = true;
    this.commandCtrl.updateCommandDisabled = false;
    this.commandCtrl.cancelCommandDisabled = false;

    this.controlDisabled = false;
    this.ctrlMgr.setControlEnable(
      [ "MemberTypeName", "CashDiscountType", "CashDiscountValue", "CreditDiscountValue", 
        "CreditDiscountType", "MemberLifeType", "StartPeriod", "EndPeriod","Lifetime",
        "Remark",  "FlagActive"], true);
    this.resetChanged();

    // let ctrl = this.memberTypeName;
    // setTimeout(function() {  
    //   ctrl.focus();
    // }, 0);
  }
  onUpdateCommand() {
    if (this.ctrlMgr.validate()) {
      this.message.openMessageDialog(
          this.translate.instant("CLC003", "MESSAGE"),
          MESSAGE_DIALOG_TYPE.QUESTION
      ).then((type: MESSAGE_DIALOG_RETURN_TYPE) => {
        if (type == MESSAGE_DIALOG_RETURN_TYPE.YES) {
          let data = this.ctrlMgr.data;
		      data.FlagSystemAdmin = this.groupID.selectedData.FlagSystemAdmin;

          let url = "api/MAS031/UpdateUser";
          if (this.screenParam.newData == true) {
            url = "api/MAS031/CreateUser";
          }
                    
          this.api.callApiController(url, {
            type: "POST",
            data: data
          }).then(
              result => {
                if (result != undefined) {
                  if (this.screenParam.newData == true) {
                    this.screenParam.newData = false;         
                    this.onInitialCommand(true);                   
                  }
                  
                  this.screenParam.userName = result["User"]["UserName"];

                  this.screenData = result;
                  this.controlDisabled = true;

                  this.ctrlMgr.data = this.screenData["User"];
                  this.ctrlMgr.setControlEnable(null, false);
                  this.resetChanged();

                  this.commandCtrl.editCommandDisabled = false;
                  this.commandCtrl.updateCommandDisabled = true;
                  this.commandCtrl.cancelCommandDisabled = true;
                }
              }
            );
          }
        });
      }
    }
    onCancelCommand() {
      if (this.screenChanged == true) {
        return this.message.openMessageDialog(
                this.translate.instant("CLC004", "MESSAGE"),
                MESSAGE_DIALOG_TYPE.QUESTION
        )
        .then((type: MESSAGE_DIALOG_RETURN_TYPE) => {
          if (type == MESSAGE_DIALOG_RETURN_TYPE.YES) {
            if (this.screenParam.newData == true) {
              if (this.tmpUserName != undefined) {
                this.screenParam.newData = false;
                this.screenParam.userName = this.tmpUserName;

                
                this.commandCtrl.editCommandDisabled = false;
                this.commandCtrl.updateCommandDisabled = true;
                this.commandCtrl.cancelCommandDisabled = true;

                this.loadData();
                this.tmpUserName = null;
              }
              else {
                this.resetChanged();
                this.backToRoot();
              }
            }
            else {
              
              this.commandCtrl.editCommandDisabled = false;
              this.commandCtrl.updateCommandDisabled = true;
              this.commandCtrl.cancelCommandDisabled = true;

              this.loadData();
            }
          }
        });
      }
      else {
        if (this.screenParam.newData == true) {
          if (this.tmpUserName != undefined) {
            this.screenParam.newData = false;
            this.screenParam.userName = this.tmpUserName;

            
            this.commandCtrl.editCommandDisabled = false;
            this.commandCtrl.updateCommandDisabled = true;
            this.commandCtrl.cancelCommandDisabled = true;

            this.loadData();
            this.tmpUserName = null;
          }
          else {
            this.backToRoot();
          }
        }
        else {
          
          this.commandCtrl.editCommandDisabled = false;
          this.commandCtrl.updateCommandDisabled = true;
          this.commandCtrl.cancelCommandDisabled = true;

          this.loadData();
        }
      }
    }
     
     private loadData(): Promise<Object> {
        console.log(this.screenParam.MemberTypeID);
        if (this.screenParam.MemberTypeID!=null) {
         
            return  this.api.callApiController("api/Master/GetMemberType", {
                        type: "POST",
                        data: {
                            MemberTypeID: this.screenParam.MemberTypeID
                        }
                    }).then(
                      (result) => {
                        if (result != undefined) {         
                          this.screenData = result;
                          this.controlDisabled = !this.screenParam.newData;
                          if (this.screenData == undefined) {
                              this.ctrlMgr.clear({
                                "FlagActive": true 
                              });
                          }
                          else {
                            this.ctrlMgr.data = this.screenData;
                          }
                          console.log(result["Lifetime"] + ":" + result["EndPeriod"]);
                          if(result["Lifetime"]==null){ 
                            if(result["EndPeriod"]!="0001-01-01T00:00:00"){
                              this.flagDay = true;
                            this.flagMonth = false;
                            this.flagYear = false;
                            }else {
                              this.flagDay = false;
                              this.flagMonth = false;
                              this.flagYear = true; //ตลอดชีพ
                            }
                            
                          }else if(result["Lifetime"]!=null){
                            
                              this.flagDay = false;
                              this.flagMonth = true;
                              this.flagYear = false;
                            
                            
                          }
                          this.checkBrandList(result);
                          this.ctrlMgr.setControlEnable(null, !this.controlDisabled);
                          this.resetChanged();

                          if(!this.controlDisabled) {
                            let ctrl = this.memberTypeName;
                            setTimeout(function() {  
                              ctrl.focus(); 
                            }, 0);                     
                          } 
                        }

                        return true;
                    });
        }

        return;
     }
      private checkBrandList(result) {
        
        var criteria = result.BrandList;
           if (criteria != null) {
               var ch = criteria.split(",");
               for (let j of ch) {
                   if (j == "HPC")
                       this.HPC = true;
                   else if (j == "HPCJ")
                       this.HPCJ = true;
                   else if (j == "PPY")
                       this.PPY = true;
               }
           }

       }
   
      onSelectLifetime(){        

        var criteria = this.ctrlMgr.data.MemberLifeType;
        
        if (criteria == 1){
            this.flagDay = true;
            this.flagMonth = false;
            this.flagYear = false;               
        }
        else if(criteria == 2){          
            this.flagDay = false;
            this.flagMonth = true;
            this.flagYear = false;
        }
        else if(criteria == 3){          
           this.flagDay = false;
           this.flagMonth = false;
           this.flagYear = true;
        }

           
        
      }
}

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
import { UserService }                 from "../user.service";

import "style-loader!./user.detail.component.scss";

@Component({
  selector: "user-detail",
  templateUrl: "./user.detail.component.html"  
})
export class UserDetailComponent extends ABaseComponent implements ConfirmChangeScreen {
    @ViewChild(CtmScreenCommand) commandCtrl: CtmScreenCommand;
    @ViewChild("firstName") firstName: CtmTextbox;
	  @ViewChild("groupID") groupID: Md2Autocomplete;

    private ctrlMgr: CtmControlManagement;
    private controlDisabled: boolean = true;
    private tmpUserName: string;

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
            root: "/s/user/s",
            screenParam: screenParam,
            commandMgr: {
                addCommand: true,
                editCommand: true,
                updateCommand: true,
                cancelCommand: true,
                backUrl: "/s/user/s"
            }            
        });  

        this.ctrlMgr = new CtmControlManagement(
            fb.group({
                "UserName": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "FirstName": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "LastName": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "Password": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "GroupID": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "NickName": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "Gender": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "CitizenID": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "BirthDate": [{value: null, disabled: true }],
                "Address": [{value: null, disabled: true }],
                "TelNo": [{value: null, disabled: true }],
                "Email": [{value: null, disabled: true }],
                "Remark": [{value: null, disabled: true }],
                "FlagActive": [{value: true, disabled: true }, Validators.compose([Validators.required])]
            }), {
                translate: translate,
                screen: "SCS021",
                mapping: {
                  "FirstName": "firstName",
                  "LastName": "lastName",
                  "Password": "password",
                  "GroupID": "groupID",
                  "NickName": "nickName",
                  "Gender": "gender",
                  "CitizenID": "citizenID",
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

    this.commandCtrl.addCommandDisabled = true;
    this.commandCtrl.editCommandDisabled = true;
    this.commandCtrl.updateCommandDisabled = false;
    this.commandCtrl.cancelCommandDisabled = false;

    this.loadData();
  }
  onEditCommand() {
    this.commandCtrl.addCommandDisabled = true;
    this.commandCtrl.editCommandDisabled = true;
    this.commandCtrl.updateCommandDisabled = false;
    this.commandCtrl.cancelCommandDisabled = false;

    this.controlDisabled = false;
    this.ctrlMgr.setControlEnable(
      [ "GroupID", "FirstName", "LastName", "Password", 
        "NickName", "Gender", "CitizenID", "BirthDate",
        "Address", "TelNo", "Email", "Remark", "FlagActive"], true);
    this.resetChanged();

    let ctrl = this.firstName;
    setTimeout(function() {  
      ctrl.focus();
    }, 0);
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

          let url = "api/SCS021/UpdateUser";
          if (this.screenParam.newData == true) {
            url = "api/SCS021/CreateUser";
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

                  this.commandCtrl.addCommandDisabled = false;
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

                this.commandCtrl.addCommandDisabled = false;
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
              this.commandCtrl.addCommandDisabled = false;
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

            this.commandCtrl.addCommandDisabled = false;
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
          this.commandCtrl.addCommandDisabled = false;
          this.commandCtrl.editCommandDisabled = false;
          this.commandCtrl.updateCommandDisabled = true;
          this.commandCtrl.cancelCommandDisabled = true;

          this.loadData();
        }
      }
    }

    private loadData(): Promise<Object> {
        if (this.screenParam.hasParameter) {
            return  this.api.callApiController("api/SCS021/GetUser", {
                        type: "POST",
                        data: {
                            UserName: this.screenParam.userName
                        }
                    }).then(
                      (result) => {
                        if (result != undefined) {
                          this.screenData = result;
                          this.controlDisabled = !this.screenParam.newData;

                          if (this.screenData["User"] == undefined) {
                              this.ctrlMgr.clear({
                                "FlagActive": true 
                              });
                          }
                          else {
                            this.ctrlMgr.data = this.screenData["User"];
                          }

                          this.ctrlMgr.setControlEnable(null, !this.controlDisabled);
                          this.resetChanged();

                          if(!this.controlDisabled) {
                            let ctrl = this.firstName;
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
}

import { 
    Component, 
    ViewChild,
    HostListener,
    ElementRef
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
    ConfirmChangeScreen,
    CONFIRM_CHANGE_SCREEN,
    ROLE_PERMISSION_TABLE,
    MESSAGE_DIALOG_TYPE,
    MESSAGE_DIALOG_RETURN_TYPE,
    Md2Autocomplete,
    textFormat
}                                       from "../../../common";
import { GroupService }                 from "../group.service";

import "style-loader!./group.detail.component.scss";

@Component({
  selector: "group-detail",
  templateUrl: "./group.detail.component.html",
})
export class GroupDetailComponent extends ABaseComponent implements ConfirmChangeScreen {
    @ViewChild(CtmScreenCommand) commandCtrl: CtmScreenCommand;
    @ViewChild("nameEN") nameEN;
    @ViewChild("userAdd") userAdd: Md2Autocomplete;

    private ctrlMgr: CtmControlManagement;
    private controlDisabled: boolean = true;
    private tmpGroupID: number;

    private permissions = ROLE_PERMISSION_TABLE;
    private permissionChanged: boolean;
    private fixedPermissionHeader: boolean = false;

    private userCtrlMgr: CtmControlManagement;
    private userData: CtmTableData;
    private userChanged: boolean;

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
        private table: CtmTableService,
        private _element: ElementRef            
    ) {
        super(router, route, spinner, translate, message, command, {
            root: "/s/group/s",
            screenParam: screenParam,
            commandMgr: {
                addCommand: true,
                editCommand: true,
                updateCommand: true,
                cancelCommand: true,
                backUrl: "/s/group/s"
            }            
        });

        this.ctrlMgr = new CtmControlManagement(
            fb.group({
                "GroupID": [{value: null, disabled: true }],
                "NameEN": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "NameLC": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "Description": [{value: null, disabled: true }],
                "CashDiscount": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "CreditDiscount": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "FlagActive": [{value: true, disabled: true }, Validators.compose([Validators.required])]
            }), {
                translate: translate,
                screen: "SCS011",
                mapping: {
                    "NameEN": "nameEN",
                    "NameLC": "nameLC",
                    "FlagActive": "flagActive",
                    "CashDiscount": "cashDiscount",
                    "CreditDiscount": "creditDiscount"
                }
            }
        );

        this.userCtrlMgr = new CtmControlManagement(
            fb.group({
                "UserName": [null]
            }), null
        );

        this.userData = new CtmTableData(table, 2, "api/SCS011/GetUserInGroup");
    }

    @HostListener("window:resize")
    public onWindowResize():void {
        this.setTableHeader();
    }
    
    @HostListener("window:scroll")
    public onWindowScroll():void {
        this.setTableHeader();
    }

    get screenCommand() { return this.commandCtrl; }
    get screenChanged() : boolean {
        return (this.ctrlMgr.changed == true
            || this.permissionChanged == true
            || this.userChanged == true);
    }
    
    initScreen(): Promise<Object> {
        return this.loadData();     
    }
    resetChanged() {
        this.ctrlMgr.resetChanged();
        this.permissionChanged = false;
        this.userChanged = false;
    }

    public confirmChange(): CONFIRM_CHANGE_SCREEN {
        return this.screenChanged ? CONFIRM_CHANGE_SCREEN.CONFIRM_UNSAVE : CONFIRM_CHANGE_SCREEN.CHANGE;
    }
    public confirmChangeResult(result: boolean) {
        if (result == true) {
            this.screenParam.groupID = null;
        }
    }

    onAddCommand() {
        this.tmpGroupID = this.screenParam.groupID;
        this.screenParam.newData = true;
        this.screenParam.groupID = null;

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
            ["NameEN", "NameLC", "CashDiscount", "CreditDiscount", "Description", "FlagActive"], true);
        this.resetChanged();

        this.userData.totalColumns = 3;
                                    
        let ctrl = this.nameEN;
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
                    data.Permissions = [];
                    data.Users = this.userData.rows;

                    let spms = this.screenData["Permissions"];
                    for(let i = 0; i < spms.length; i++) {
                        for(let j = 0; j < spms[i].Screens.length; j++) {
                            let scn = spms[i].Screens[j];
                            for(let k = 0; k < this.permissions.length; k++) {
                                let p = this.permissions[k];
                                if (scn[p.propROL] == true) {
                                    data.Permissions.push({ 
                                        GroupID: data.GroupID,
                                        ScreenID: scn.ScreenID,
                                        PermissionID: p.permissionID
                                    });
                                }
                            }
                        }
                    }

                    let url = "api/SCS011/UpdateUserGroup";
                    if (this.screenParam.newData == true) {
                        url = "api/SCS011/CreateUserGroup";
                    }
                    
                    this.api.callApiController(url, {
                        type: "POST",
                        data: data
                    }).then(
                        result => {
                            if (result != undefined) {
                                if (result["IsCurrentUser"] == true
                                            && this.permissionChanged == true) {
                                    this.message.openMessageDialog(
                                        this.translate.instant("CLC007", "MESSAGE"),
                                        MESSAGE_DIALOG_TYPE.QUESTION
                                    ).then((type: MESSAGE_DIALOG_RETURN_TYPE) => {
                                        if (type == MESSAGE_DIALOG_RETURN_TYPE.YES) {
                                            this.router.navigate(["/login"]);
                                        }
                                        else {
                                            this.screenParam.groupID = result["Group"]["GroupID"];

                                            this.screenData = result;
                                            this.controlDisabled = true;

                                            this.ctrlMgr.data = this.screenData["Group"];
                                            this.ctrlMgr.setControlEnable(null, false);
                                            this.resetChanged();

                                            this.userData.totalColumns = 2;
                                            this.userData.loadData({
                                                GroupID: this.screenData["Group"].GroupID
                                            });

                                            this.commandCtrl.addCommandDisabled = false;
                                            this.commandCtrl.editCommandDisabled = false;
                                            this.commandCtrl.updateCommandDisabled = true;
                                            this.commandCtrl.cancelCommandDisabled = true;
                                        }
                                    });
                                }
                                else {
                                    if (this.screenParam.newData == true) {
                                        this.screenParam.newData = false;         
                                        this.onInitialCommand(true);                   
                                    }
                                
                                    this.screenParam.groupID = result["Group"]["GroupID"];

                                    this.screenData = result;
                                    this.controlDisabled = true;

                                    this.ctrlMgr.data = this.screenData["Group"];
                                    this.ctrlMgr.setControlEnable(null, false);
                                    this.resetChanged();

                                    this.userData.totalColumns = 2;
                                    this.userData.loadData({
                                        GroupID: this.screenData["Group"].GroupID
                                    });

                                    this.commandCtrl.addCommandDisabled = false;
                                    this.commandCtrl.editCommandDisabled = false;
                                    this.commandCtrl.updateCommandDisabled = true;
                                    this.commandCtrl.cancelCommandDisabled = true;
                                }
                            }
                        }
                    );
                }
            });
        } 
    }
    onCancelCommand() {
        if (this.ctrlMgr.changed == true) {
            return this.message.openMessageDialog(
                this.translate.instant("CLC004", "MESSAGE"),
                MESSAGE_DIALOG_TYPE.QUESTION
            )
                .then((type: MESSAGE_DIALOG_RETURN_TYPE) => {
                    if (type == MESSAGE_DIALOG_RETURN_TYPE.YES) {
                        if (this.screenParam.newData == true) {
                            if (this.tmpGroupID != undefined) {
                                this.screenParam.newData = false;
                                this.screenParam.groupID = this.tmpGroupID;

                                this.commandCtrl.addCommandDisabled = false;
                                this.commandCtrl.editCommandDisabled = false;
                                this.commandCtrl.updateCommandDisabled = true;
                                this.commandCtrl.cancelCommandDisabled = true;

                                this.loadData();
                                this.tmpGroupID = null;
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
                if (this.tmpGroupID != undefined) {
                    this.screenParam.newData = false;
                    this.screenParam.groupID = this.tmpGroupID;

                    this.commandCtrl.addCommandDisabled = false;
                    this.commandCtrl.editCommandDisabled = false;
                    this.commandCtrl.updateCommandDisabled = true;
                    this.commandCtrl.cancelCommandDisabled = true;

                    this.loadData();
                    this.tmpGroupID = null;
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
            return  this.api.callApiController("api/SCS011/GetUserGroup", {
                        type: "POST",
                        data: {
                            GroupID: this.screenParam.groupID
                        }
                    }).then(
                        (result) => {
                            if (result != undefined) {
                                this.screenData = result;
                                this.controlDisabled = !this.screenParam.newData;

                                if (this.screenData["Group"] == undefined) {
                                    this.ctrlMgr.clear({"FlagActive": true });
                                }
                                else {
                                    this.ctrlMgr.data = this.screenData["Group"];
                                }

                                this.ctrlMgr.setControlEnable(null, !this.controlDisabled);
                                this.resetChanged();

                                if (this.screenParam.newData == true) {
                                    this.userData.totalColumns = 3;
                                }
                                else {
                                    this.userData.totalColumns = 2;
                                }
                                if (this.screenData["Group"] == undefined) {
                                    this.userData.clearData();
                                }
                                else {
                                    this.userData.loadData({
                                        GroupID: this.screenData["Group"].GroupID
                                    });
                                }
                                if(!this.controlDisabled) {
                                    let ctrl = this.nameEN;
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

    private userName(row) {
        return textFormat("{0}: {1} {2}", [row["UserName"], row["FirstName"], row["LastName"]]); 
    }
    private onAddUser() {
        let data = this.userCtrlMgr.data;
        if (data.UserName != undefined) {
            if ($.grep(this.userData.rows, function(val) {
                return val["UserName"] == data.UserName;
            }).length > 0) {
                this.message.openMessageDialog("Exist");
            }
            else {
                this.userChanged = true;
                this.userData.insertRow(this.userAdd.selectedData);
            }

            this.userCtrlMgr.clear({});
        }
    }
    private onDeleteUser(row) {
        this.userChanged = true;
        this.userData.deleteRow(row);
        return false;
    }

    private get groupPermissions() {
        if (this.screenData != undefined) {
            return this.screenData["Permissions"];
        }

        return [];
    }
    private groupName(grp) {
        if (this.translate.isLanguageEN == true) {
            return grp.GroupNameEN;
        }

        return grp.GroupNameLC;
    }
    private screenName(scn) {
        if (this.translate.isLanguageEN == true) {
            return scn.NameEN;
        }

        return scn.NameLC;
    }

    private onPermissionChange(scn, p) {
      this.permissionChanged = true;

      if (p.permissionID == 1) {
        for(let k = 0; k < this.permissions.length; k++) {
          let cp = this.permissions[k];

          if (scn[cp.propSCN] == true) {
            scn[cp.propROL] = scn[p.propROL];
          }
        }
      }
    }

    private setTableHeader() {
        let mCtrl = this._element.nativeElement.querySelector('.table-permission-main');
        let hCtrl = this._element.nativeElement.querySelector('.table-permission-header');

        let top = 0, c;
        c = mCtrl;
        do {
            top += c.offsetTop  || 0;
            c = c.offsetParent;
        } while(c);

        let ptop = $(document.body).find(".page-top").outerHeight();
        
        let height = $(mCtrl).outerHeight();
        let scroll = (document.body.scrollTop + ptop);

        if ((scroll < (top + height - 40)) && (top - scroll < 0)) {
          this.fixedPermissionHeader = true;

          let mscroll = $(mCtrl)
          let hscroll = $(hCtrl);
          let mheader = mscroll.find("table");
          let header = hscroll.find("table");

          mscroll.unbind("scroll");
          mscroll.bind("scroll", function() {
            setTimeout(function() {
                 hscroll.scrollLeft(mscroll.scrollLeft());
            }, 10);
          });
          
          hscroll.unbind("scroll");
          hscroll.bind("scroll", function() {
            setTimeout(function() {
                 mscroll.scrollLeft(hscroll.scrollLeft());
            }, 10);
          });

          hscroll.css({ 
            top: ptop + "px",
            width: mscroll.width() + "px" 
          });
          hscroll.scrollLeft(mscroll.scrollLeft());
          
          header.width(mheader.width());
          header.empty();
          header.append(mheader.find("colgroup").clone());
          header.append(mheader.find("thead").clone());

        }
        else {
          this.fixedPermissionHeader = false;
        }
    }
}
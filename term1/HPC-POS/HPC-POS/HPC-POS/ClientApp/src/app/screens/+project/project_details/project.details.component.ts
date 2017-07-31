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
            root: "/s/master/b/s",
            screenParam: screenParam,
            commandMgr: {
                // addCommand: true,
                editCommand: true,
                updateCommand: true,
                cancelCommand: true,
                backUrl: "/s/master/b/s"
            }            
        });  
        this.resultData = new CtmTableData(table, 3, "api/master/GetZoneList");
        // console.log(this.resultData)

        this.ctrlMgr = new CtmControlManagement(

        
            fb.group({
                "BrandCode":[{value: null, disabled: true }],
                "BranchCode": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "BranchName": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "BranchShortNameEN": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "BranchShortNameTH": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "BillHeader": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "LocationCode": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "BranchAddress": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "ProvinceID": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "CantonID": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "DistrictID": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "ZipCode": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "TelNo": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "FaxNo": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "TemplateID": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "TaxID": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "TaxBranchCode": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "ServiceCharge": [{value: null, disabled: true }, Validators.compose([Validators.required])],
                "ZoneName":[{value: null, disabled: true }],
                "Remark":[{value: null, disabled: true }],
                "TablePrefix":[{value: null, disabled: true }],
                "TableNo":[{value: null, disabled: true }],
                "To":[{value: null, disabled: true }],
                "ServiceCharge2":[{value: null, disabled: true }],
                "FlagDefault":[{value: null, disabled: true }],
                "FlagActive":[{value: null, disabled: true }],
                "ConstantValue":[{value: null, disabled: true }],
            }), {
                translate: translate,
                screen: "MAS021",
                mapping: {
                  "BrandCode": "BrandCode",
                  "BranchCode": "BranchCode",
                  "BranchName": "BranchName",
                  "BranchShortNameEN": "BranchShortEN",
                  "BranchShortNameTH": "BranchShortTH",
                  "BillHeader": "BillHeader",
                  "ProvinceID": "ProvinceID",
                  "DistrictID": "DistrictID",
                  "ZipCode": "ZipCode",
                  "TelNo": "TelNo",
                  "FaxNo": "FaxNo",
                  "TaxID": "TaxID",
                  "TaxBranchCode": "TaxBranchCode",
                  "ServiceCharge": "ServiceCharge"
                }
            }
        );
         
        
  }

  list = {
                ZoneName:null,
                Remark:null,
                TablePrefix:null,
                TableNo:null,
                To:null,
                ServiceCharge2:null,
                FlagDefault:null,
                FlagActive:null,
                ConstantValue:null
    };

  get screenCommand() { return this.commandCtrl; }
  get screenChanged() : boolean {
    return this.ctrlMgr.changed == true;
  }
  
  initScreen(): Promise<Object> {
    let criteria = this.screenParam;
      //this.resultData.clearData();
      // console.log(this.resultData.loadData(criteria))
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
      this.screenParam.BranchName = null;
    }
  }

  onAddCommand() {
    this.tmpUserName = this.screenParam.userName;
    this.screenParam.newData = true;
    this.screenParam.BranchID = null;

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
      [ "BrandCode", "BranchCode", "BranchName", "BranchShortNameEN", 
        "BranchShortNameTH", "BillHeader", "LocationCode", "BranchAddress",
        "ProvinceID", "CantonID", "DistrictID", "ZipCode", "TelNo",
        "FaxNo","TemplateID","TaxID","TaxBranchCode","ServiceCharge"], true);
    this.resetChanged();

    let ctrl = this.screenParam.BranchCode;
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
		      data.FlagSystemAdmin = this.BrandCode.selectedData.FlagSystemAdmin;

          let url = "api/MAS021/UpdateUser";
          if (this.screenParam.newData == true) {
            url = "api/MAS021/CreateUser";
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
       console.log(this.ctrlMgr.data);
        if (this.screenParam.BranchID!=null) {
            return  this.api.callApiController("api/master/GetBranchDetails", {
                        type: "POST",
                        data: {
                            BranchID: this.screenParam.BranchID
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
                          // console.log(this.ctrlMgr.data);
                          this.ctrlMgr.setControlEnable(null, !this.controlDisabled);
                          this.resetChanged();

                          if(!this.controlDisabled) {
                            let ctrl = this.screenParam.BranchName;
                            setTimeout(function() {  
                              ctrl.focus(); 
                            }, 0);                     
                          } 
                        }
                        this.resultData.loadData(this.screenParam);

                        return true;
                    });
                      
        }else{
           this.ctrlMgr.setControlEnable(null, this.controlDisabled);
        }
        return;
    }
    private onSelectRow(row){
        console.log(row);
        
        this.list = this.ctrlMgr.data;
        this.list.ZoneName = row.ZoneName;
        this.list.Remark = row.Remark;
        this.list.TablePrefix = row.TablePrefix;
        this.list.TableNo = row.GenerateTableFrom;
        this.list.To = row.GenerateTableTo;
        this.list.ServiceCharge2=row.ServiceCharge;
        this.list.FlagDefault=row.FlagDefault;
        this.list.FlagActive=row.FlagActive;
        this.list.ConstantValue=row.TakeAway;

        this.ctrlMgr.data = this.list;
        console.log(this.ctrlMgr.data);
        
        // console.log(this.ctrlMgr.data);
        // if(row.ServiceCharge)
        //   this.ctrlMgr.data.Zone_ServiceCharge.checked = true;
        // if(row.FlagDefault)
        //   this.ctrlMgr.data.Zone_FlagDefault.checked = true;
    }
    private onSelectProvince(){
      
                    this.api.callApiController("api/master/GetCantonAutoComplete", {
                        type: "POST",
                        data: {
                            ProvinceID: this.ctrlMgr.data.ProvinceID
                        }
                    }).then(
                      (result) => {
                        if (result != undefined) {
                          // this.screenData = result;
                          // this.controlDisabled = !this.screenParam.newData;
                         
                          // if (this.screenData == undefined) {
                          //     this.ctrlMgr.clear({
                          //       "FlagActive": true 
                          //     });
                          // }
                          // else {
                          //   this.ctrlMgr.data = this.screenData;
                          // }
                         // this.ctrlMgr. = result; //------------พัง
                         //this.CantonID.writeValue(result);
                          console.log(result);
                        }

                        return true;
                    });
    }
    
       
}

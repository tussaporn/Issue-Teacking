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
  selector: "common",
  templateUrl: "./common.component.html",
})
export class MasterCommonComponent extends ABaseComponent {
    @ViewChild(CtmScreenCommand) commandCtrl: CtmScreenCommand;
    private criteriaCtrlMgr: CtmControlManagement;
    private resultData: CtmTableData;
    lists: Array<Object> = [];
    

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
                deleteCommand:true

            }      
        });
              
        this.criteriaCtrlMgr = new CtmControlManagement(
            fb.group({
                "MSTCode" : ["001"]
            })
        );

         this.resultData = new CtmTableData(table, 7, "api/Master/GetSmallMasterDetail");
    }

 

  note = {
                Value1Description:null,
                Value2Description:null,
                Value3Description:null
              }
  screenChanged: boolean = false;
 get screenCommand() { return this.commandCtrl; }
  initScreen(): Promise<Object> {
        
        this.commandCtrl.useAddCommand = true;
        this.commandCtrl.addCommandDisabled = false;
        
        this.onSearch();
        this.noteDetail();
        return ;
  }

onAddCommand() {
           
        this.router.navigate(["/s/user/d"]);
    }

   private onSearch() {
      var criteria = this.criteriaCtrlMgr.data;
      
      this.resultData.loadData(criteria);
      this.noteDetail();
      
    }

    onDelete() {
           
        //window.confirm("Are you sure?");
        var r = confirm("Are you sure?");
    if (r == true) {
        //window.alert("You pressed OK!");
        //this.router.navigate(["/s/user/"]);
    } else {
       //window.alert("You pressed Cancel!");
        //this.router.navigate(["/s/user/d"]);
    }
    }

    private noteDetail(){
        if(this.criteriaCtrlMgr.data.MSTCode!=null){
        this.api.callApiController("api/Master/GetSmallMasterDetailDesc", {
                        type: "POST",
                        data:this.criteriaCtrlMgr.data
                    }).then(
                    
                        (result) => { 
                        //  if(this.translate.isLanguageEN==true){
                        //      this.note.Value1Description = result.Value1DescriptionEN;
                        //       this.note.Value2Description = result.Value2DescriptionEN;
                        //        this.note.Value3Description = result.Value3DescriptionEN;
                        //        console.log(this.note);
                        //  }else{
                        //      this.note.Value1Description = result.Value1DescriptionLC;
                        //       this.note.Value2Description = result.Value2DescriptionLC;
                        //        this.note.Value3Description = result.Value3DescriptionLC;

                        //  }

                     }
                        
                    );
                    
        }
        
      return ;
    }


    private onSelectRow(row){
        // this.screenParam.value = row.UserName;
        // this.screenParam.criteria = this.resultData.criteria;

        this.router.navigate(["/s/user/"]);
        return false;
    }

     
  resetChanged() { }

  

}

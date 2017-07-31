import { 
    Component, 
    OnInit, 
    ViewChild 
}                         from "@angular/core";
import { FormGroup, AbstractControl, FormBuilder, Validators }  from "@angular/forms";
import { Router, ActivatedRoute }                               from "@angular/router";

import {
    ApiService,
    CtmTranslateService,
    CtmControlManagement,
    CtmTextbox,
    CtmMessageService,
    MESSAGE_DIALOG_TYPE,
    MESSAGE_DIALOG_RETURN_TYPE,
    DEFAULT_GROUP_CHECKER,
    USER_LOCAL_STORAGE,
    BaThemeSpinner,
    SERVER_PATH
}                                                               from "../../common";
import { 
	LgChangePasswordDialog 
}                                                               from "./components";

import "style-loader!./login.component.scss";

@Component({
    selector: "login",
    templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
	@ViewChild(LgChangePasswordDialog) changeDlg: LgChangePasswordDialog;

    @ViewChild("userName") userName: CtmTextbox;
    @ViewChild("password") password: CtmTextbox;

    private returnUrl: string;
    private ctrlMgr: CtmControlManagement;
    private hideLogin: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,

        private fb: FormBuilder,
        private api: ApiService,
        private translate: CtmTranslateService,
        private message: CtmMessageService,
        public spinner: BaThemeSpinner
    ) {
        this.ctrlMgr = new CtmControlManagement(
            fb.group({
                "Username": [null, Validators.compose([Validators.required])],
                "Password": [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(20)])]
            }), {
                translate: translate,
                screen: "CMS010",
                mapping: {
                    "Username": "username",
                    "Password": "password"
                }
            }                
        );
    }
    
    ngOnInit() {
        this.api.callApiController("api/CMS010/Initial", {
            type: "POST"
        }).then(() => {
            this.spinner.hide(500);
        });

        this.changeDlg.onChangePassComplete.subscribe(()=> {
            this.ctrlMgr.clear({});
            this.userName.focus();
        });
        
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
        this.userName.focus();
    }

    public onSubmit() {
        if (this.ctrlMgr.validate(function (field, key) {
            if (field == "password"
                && (key == "minlength" || key == "maxlength")) {
                return this._translate.instant("CLE002", "MESSAGE");
            } 

            return null;
        })) {
            this.api.callApiController("api/CMS010/Login", {
                type: "POST",
                data: this.ctrlMgr.data
            }).then(
                (result) => {
                    if (result != undefined) {
                        if (result["IsPasswordExpired"] == true) {
                            this.changeDlg.open(this.ctrlMgr.data.Username);
                        }
                        else {
                            let loc = {
                                userName: result["UserName"],
                                displayName: result["DisplayName"],
                                groupID:  result["GroupID"]
                            };
                            
                            localStorage.removeItem(USER_LOCAL_STORAGE);
                            localStorage.setItem(USER_LOCAL_STORAGE, JSON.stringify(loc));

                            this.router.navigate([this.returnUrl]);
                        }
                    }
                }
            );
        }        
    }    

    onUsernameKeypress($event) {
        if ($event.keyCode == 13) {
            this.password.focus();
        }
    }
    onPasswordKeypress($event) {
        if ($event.keyCode == 13) {
            this.onSubmit();
        }
    }
}

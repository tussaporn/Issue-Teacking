import { 
    Component,
    ViewChild,
    EventEmitter,
    Output
}                                   from "@angular/core";
import { 
    FormGroup, 
    AbstractControl, 
    FormBuilder, 
    Validators 
}                                   from "@angular/forms";
import {
    Router,
    ActivatedRoute
}                                   from "@angular/router";

import {
    Md2Dialog,
    Md2Autocomplete,

    ApiService,
    CtmTranslateService,
    CtmControlManagement,
    CtmMessageService,
    cloneObject,
    TheatreSubAutoCompleteCriteria,
    BaThemeSpinner,
    CtmTextbox,
    MESSAGE_DIALOG_TYPE,
    CtmControlResource
}                                   from "../../../../common";


import "style-loader!./changepass.scss";

@Component({
  selector: "lg-changepass-dialog",
  templateUrl: "changepass.component.html"
})
export class LgChangePasswordDialog {
    @ViewChild("changeDlg") changeDlg: Md2Dialog;
    @ViewChild("oldPassword") oldPassword: CtmTextbox;

    private ctrlMgr: CtmControlManagement;

    constructor(
        private route: ActivatedRoute,
        private router: Router,

        private fb: FormBuilder,
        private api: ApiService,
        private translate: CtmTranslateService,
        private message: CtmMessageService
    ) {
        this.ctrlMgr = new CtmControlManagement(
            fb.group({
                "Username": [{value: null, disabled: true}],
                "OldPassword": [null, Validators.compose([Validators.required,Validators.minLength(4), Validators.maxLength(20)])],
                "NewPassword": [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(20)])],
                "ConfirmPassword": [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(20)])]
            }), {
                translate: translate,
                screen: "CMS010",
                mapping: {
                    "OldPassword": "oldPassword",
                    "NewPassword": "newPassword",
                    "ConfirmPassword": "confirmPassword"
                }
            }                    
        );
    }

    ngOnInit() {
    }

    public open(userName: string) {
        let data = this.ctrlMgr.data;
        data.Username = userName;
        this.ctrlMgr.data = data;

        this.changeDlg.open()
            .then(() =>  {
                this.oldPassword.focus();
            });
    }

    @Output()
    public onChangePassComplete: EventEmitter<any> = new EventEmitter();

    private onChangePass() {
        if (this.ctrlMgr.validate()) {
            let data = this.ctrlMgr.data;
            if (data.NewPassword != data.ConfirmPassword) {
                this.message.openMessageDialog("Confirm Password not equal with New Password.", 
                    MESSAGE_DIALOG_TYPE.ERROR);
            }
            else {
                this.api.callApiController("api/CMS010/ChangePassword", {
                    type: "POST",
                    data: data
                }).then(
                    (result) => {
                        if (result == true) {
                            this.changeDlg.close()
                                .then(() => {
                                    this.onChangePassComplete.emit();
                                });
                            
                        }
                    }
                );
                
            }
        }
    }
}
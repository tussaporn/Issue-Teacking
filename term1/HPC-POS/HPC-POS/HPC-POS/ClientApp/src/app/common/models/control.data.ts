import {
  EventEmitter
}                                       from "@angular/core";
import { FormGroup }                    from "@angular/forms";

import { textFormat }                   from "../base";
import { 
    CtmTranslateService
}                                       from "../services";
import {
    ResponseMessage
}                                       from "./message.data";

export class CtmControlResource {
    translate: CtmTranslateService;
    screen: string;
    mapping: any;
}

export class CtmControlManagement {
    public formErrors;
    public changed: boolean = false;
    public beginChange: boolean = false;

    constructor(
        private form: FormGroup,
        private resource: CtmControlResource = null                
    ) {
        this.formErrors = {};
        for (let ctrl in this.form.controls) {
            this.formErrors[ctrl] = {
                key: null,
                message: null
            };
        }

        this.form.valueChanges
            .subscribe(data => this.onValueChanged(data));
        this.changed = false;
    }

    public change: EventEmitter<any> = new EventEmitter<any>();

    private onValueChanged(data?: any) {
        if (!this.form) {
            return;
        }

        for (let field in this.formErrors) {
            let control = this.form.get(field);
            if (control && !control.valid) {
                for (let key in control.errors) {
                    if (this.formErrors[field].key != key) {
                        this.formErrors[field].key = null;
                        this.formErrors[field].message = null;
                    }
                }
            }
            else {
                this.formErrors[field].key = null;
                this.formErrors[field].message = null;
            }
        }

        if (this.beginChange == true) {
            this.changed = true;
            this.change.emit();
        }
    }

    public get data() {
        let data = {};
        for (let ctrl in this.form.controls) {
            data[ctrl] = this.form.controls[ctrl].value;
        }
    
        return data;
    }
    public set data(d: any) {
        if (d != undefined) {
            for (let ctrl in this.form.controls) {
                this.form.controls[ctrl].setValue(d[ctrl]);
            }
        }
    }

    public error(name: string) {
        return this.formErrors[name].message;
    }
    public clear(option) {
        for (let ctrl in this.form.controls) {
            if (option != undefined) {
                this.form.controls[ctrl].setValue(option[ctrl]);
            }
            else {
                this.form.controls[ctrl].setValue(null);
            }
        }
    }
    public clearValidate(name: any = null) {
        if (typeof name === "string") {
            this.formErrors[name].message = new ResponseMessage();
        }
        else if (name instanceof Array) {
            for(let idx = 0; idx < name.length; idx++) {
                this.formErrors[name[idx]].message = new ResponseMessage();
            }
        }
        else {
            for (let field in this.formErrors) {
                this.formErrors[field].message = new ResponseMessage();
            }
        }
    }

    public validate(custom: Function = null): boolean {
        if (!this.form.valid) {
            let hasError: boolean = false;

            for (let field in this.formErrors) {
                this.formErrors[field].key = null;
                this.formErrors[field].message = null;

                let control = this.form.get(field);
                if (control && !control.valid) {
                    for (let key in control.errors) {
                        this.formErrors[field].key = key;

                        if (typeof (custom) == "function") {
                            let msg = custom(field, key);
                            if (msg != undefined) {
                                if (msg != "") {
                                    this.formErrors[field].message = msg;
                                    hasError = true;
                                }           

                                continue;
                            }
                        }

                        if (key == "required") {
                            if (this.resource != undefined) {
                                if (this.resource.translate != undefined
                                    && this.resource.screen != undefined) {
                                    let screen = this.resource.screen;
                                    let resourceName = field;
                                    if (this.resource.mapping != undefined) {
                                        if (this.resource.mapping[field]) {
                                            if (typeof(this.resource.mapping[field]) == "string") {
                                                resourceName = this.resource.mapping[field];
                                            }
                                            else {
                                                resourceName = this.resource.mapping[field].name;
                                                if (this.resource.mapping[field].screen) {
                                                    screen = this.resource.mapping[field].screen;
                                                }
                                            }
                                        }
                                    }

                                    this.formErrors[field].message =
                                        textFormat(
                                            this.resource.translate.instant("CLE001", "MESSAGE"),
                                        [   this.resource.translate.instant(resourceName, screen)]);
                                }
                                else {
                                    this.formErrors[field].message = field;
                                }
                            }                            
                            else {
                                this.formErrors[field].message = field;
                            }

                            hasError = true;
                        }
                    }
                }
            }

            return !hasError;
        }

        return true;
    }

    public setControlEnable(targets: Array<string>, enable: boolean) {
        if (targets != undefined) {
            for (let i = 0; i < targets.length; i++) {
                let ctrl = this.form.controls[targets[i]];
                if (ctrl != undefined) {
                    if (enable) {
                        ctrl.enable();
                    }
                    else {
                        ctrl.disable();
                    }
                }
            }
        }
        else {
            for (let c in this.form.controls) {
                let ctrl = this.form.controls[c];
                if (enable) {
                    ctrl.enable();
                }
                else {
                    ctrl.disable();
                }
            }
        }
    }
    public resetChanged() {
        this.beginChange = true;
        this.changed = false;
    }
}
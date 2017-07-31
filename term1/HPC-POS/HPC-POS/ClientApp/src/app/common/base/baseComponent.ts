import {
    OnInit, 
    AfterViewInit,
    ViewChild
}                                       from "@angular/core";
import {
    Router,
    ActivatedRoute
}                                       from "@angular/router";

import { 
    USER_LOCAL_STORAGE
}                                       from "../common.constant";
import { 
    cloneObject,
    textNumeric 
}                                       from "../base";
import { 
    CtmCommandService,
    CtmTranslateService,
    CtmMessageService
}                                       from "../services";
import {
    CtmCommandManagement
}                                       from "../models";

import { CtmScreenCommand }             from "../components";

import { RoleData }                     from "../guards";
import { ROLE_PERMISSION }              from "../common.permission";
import { BaThemeSpinner }               from "../services";

import moment from "moment";

export abstract class AScreenParameter {
    private _newData: boolean;
    private _criteria: any;
    
    public get newData(): boolean {
        return this._newData;
    }
    public set newData(n: boolean) {
        this._newData = n;
    }

    public abstract key: any;

    public get criteria(): any {
        return this._criteria;
    }
    public set criteria(criteria: any) {
        if (criteria == undefined) {
            this._criteria = null;
        }
        else {
            this._criteria = cloneObject(criteria);
        }
    }

    public get hasParameter(): boolean {
        return this.newData
                || this.key != undefined;
    }
}
export class BaseComponentParameter {
    public root?: string;
    public screenParam?: AScreenParameter;
    public commandMgr?: CtmCommandManagement;
}
export abstract class ABaseComponent implements OnInit, AfterViewInit {
    private redirectPage: boolean = false;
    public screenData: any;
    
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public spinner: BaThemeSpinner,
        public translate: CtmTranslateService,
        public message: CtmMessageService,
        public command: CtmCommandService,
        public param: BaseComponentParameter
    ) {
        if (this.param.screenParam != undefined) {
            if (!this.param.screenParam.hasParameter) {
                if (this.param.root != undefined) {
                    this.redirectPage = true;
                    this.router.navigate([this.param.root]);
                    return;
                }
            }
        }

        if (this.command != undefined) {   
            this.command.setBackCommand(this.param.commandMgr);
        }
    }

    abstract screenCommand: CtmScreenCommand;
	abstract screenChanged: boolean;
    abstract initScreen(): Promise<Object>;
    abstract resetChanged();

	ngOnInit() { 
		$(".content-loading").show();
        this.onInitialCommand();
    }
    ngAfterViewInit() {
        let init = this.initScreen();
        if (init instanceof Promise) {
            init.then(() => {
				// $(".content-loading").animate({
				// 	top: "100%"
				// }, "slow", function () {
				// 	$(".content-loading").hide();
				// 	$(".content-loading").css({ top: 0 });
				// });
                $(".content-loading").fadeOut(500);
                jQuery("html, body").animate({ scrollTop:0 }, { duration: 1000 });
            });
        }
        else {
			// $(".content-loading").animate({
			// 	top: "100%"
			// }, "slow", function () {
			// 	$(".content-loading").hide();
			// 	$(".content-loading").css({ top: 0 });
			// });
            $(".content-loading").fadeOut(500);
            jQuery("html, body").animate({ scrollTop:0 }, { duration: 1000 });
        }           
    }

    public get screenParam(): any {
        return this.param.screenParam;
    }
    public set screenParam(param: any) {
        this.param.screenParam = param;
    }

	onExportCommand() { }
    onAddCommand() { }
    onEditCommand() { }
    onDeleteCommand() { }
    onUpdateCommand() { }
    onCancelCommand() { }

    public onInitialCommand(refresh: boolean = false) {
        if (this.screenCommand == undefined) {
            return;
        }

        if (this.param.commandMgr != undefined) {
            let role = this.route.snapshot.data["role"] as RoleData;
            if (role != undefined) {
                this.screenCommand.useAddCommand = this.param.commandMgr.addCommand && role.hasPermission(ROLE_PERMISSION.ADD);
                this.screenCommand.useEditCommand = this.param.commandMgr.editCommand && role.hasPermission(ROLE_PERMISSION.EDIT);
                this.screenCommand.useDeleteCommand = this.param.commandMgr.deleteCommand && role.hasPermission(ROLE_PERMISSION.DELETE);
				this.screenCommand.useExportCommand = this.param.commandMgr.exportCommand && role.hasPermission(ROLE_PERMISSION.EXPORT);

                if (this.screenCommand.useAddCommand 
                    || this.screenCommand.useEditCommand) {
                    this.screenCommand.useUpdateCommand = this.param.commandMgr.updateCommand;
                    this.screenCommand.useCancelCommand = this.param.commandMgr.cancelCommand;
                    
                }
            }
        }

        if (refresh != true) {
            this.screenCommand.addCommand.subscribe(()=> this.onAddCommand());
            this.screenCommand.editCommand.subscribe(()=> this.onEditCommand());
            this.screenCommand.deleteCommand.subscribe(()=> this.onDeleteCommand());
            this.screenCommand.updateCommand.subscribe(()=> this.onUpdateCommand());
			this.screenCommand.cancelCommand.subscribe(() => this.onCancelCommand());

			this.screenCommand.exportCommand.subscribe(() => this.onExportCommand());
        }
    
        if (this.screenCommand.useAddCommand) {
            this.screenCommand.addCommandDisabled = false;            
        }
        if (this.screenCommand.useEditCommand) {
            this.screenCommand.editCommandDisabled = false;            
        }
        if (this.screenCommand.useDeleteCommand) {
            this.screenCommand.deleteCommandDisabled = false;            
        }
		if (this.screenCommand.useExportCommand) {
			this.screenCommand.exportCommandDisabled = false;
		}

        if (this.param.screenParam != undefined) {
            if (this.param.screenParam.newData == true) {
                this.screenCommand.useAddCommand = false;
                this.screenCommand.useEditCommand = false;
                this.screenCommand.useDeleteCommand = false;

                if (this.screenCommand.useUpdateCommand) {
                    this.screenCommand.updateCommandDisabled = false;
                }
                if (this.screenCommand.useCancelCommand) {
                    this.screenCommand.cancelCommandDisabled = false;
                }
            }
        }
    }

    public get currentUser(): any {
        let loc = localStorage.getItem(USER_LOCAL_STORAGE);
        if (loc != undefined) {
            let usr = JSON.parse(loc);
            if (usr != undefined) {
                return usr;
            }
        }

        return {};
    }
    public backToRoot() {
        if (this.param.root != undefined) {
            this.router.navigate([this.param.root]);
        }
    }

    public hasPermissionOpen(s: string = null): boolean {
        return this.hasPermission(s, ROLE_PERMISSION.OPEN);
    }
    public hasPermissionAdd(s: string = null): boolean {
        return this.hasPermission(s, ROLE_PERMISSION.ADD);
    }
    public hasPermissionEdit(s: string = null): boolean {
        return this.hasPermission(s, ROLE_PERMISSION.EDIT);
    }
    public hasPermissionDelete(s: string = null): boolean {
        return this.hasPermission(s, ROLE_PERMISSION.DELETE);
    }
    public hasPermissionExport(s: string = null): boolean {
        return this.hasPermission(s, ROLE_PERMISSION.EXPORT);
    }
    
    public textNumeric(val, scale = 0, suffix = "") {
        let num = textNumeric(val, { comma: true, scale: scale });
        if (num != "") {
            num += suffix;
        }
        
        return num;
    }

    private hasPermission(s: string, p: ROLE_PERMISSION): boolean {
        let role = this.route.snapshot.data["role"] as RoleData;
        if (role == undefined) {
            return false;
        }

        if (s != undefined) {
            return role.hasScreenPermission(s, p);            
        }

        return role.hasPermission(p);        
    }
}
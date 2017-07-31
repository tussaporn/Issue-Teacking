import { 
    Component 
}                                   from "@angular/core";
import {
    Router,
    NavigationStart
}                                   from "@angular/router";

import { 
    GlobalState 
}                                   from "../../../global.state";

import {
    MENU_GLOBAL_ACTIVELINK,
    COMMAND_GLOBAL_BACK
}                                   from "../../common.constant";
import {
    CtmCommandManagement
}                                   from "../../models";

@Component({
  selector: "ba-content-top",
  styleUrls: ["./baContentTop.scss"],
  templateUrl: "./baContentTop.html",
})
export class BaContentTop {
    public activePageTitle: string = "";
    private currentUrl: string;
    private previousUrl: string;

    private useBackCommand: boolean = false;
    private backUrl: string;

    constructor(
        private router: Router,
        private global: GlobalState
    ) {
        this.global.subscribe(MENU_GLOBAL_ACTIVELINK, (activeLink) => {
            if (activeLink) {
                this.activePageTitle = activeLink.title;
            }
            else {
                this.activePageTitle = "";
            }
        });
        this.global.subscribe(COMMAND_GLOBAL_BACK, (command: CtmCommandManagement) => {
            if (command != undefined) {
                if (command.backUrl != undefined) {
                    this.useBackCommand = true;
                    this.backUrl = command.backUrl;
                }
                else {
                    this.useBackCommand = false;
                    this.backUrl = null;
                }
            }
            else {
                this.useBackCommand = false;
                this.backUrl = null;
            }
        });

        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                if (this.currentUrl != undefined) {
                    this.previousUrl = this.currentUrl;
                }
                this.currentUrl = event.url;
            }
        });    
    }

    private onBackCommand() {
        if (this.backUrl != undefined) {
            this.router.navigate([this.backUrl]);
        }
        else {
            this.router.navigate([this.previousUrl ? this.previousUrl : "/"]);
        }
    }
}
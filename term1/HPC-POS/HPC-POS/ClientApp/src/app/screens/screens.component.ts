import { 
    Component,
    OnInit
}                           from "@angular/core";
import {
	Routes
}							from "@angular/router";

import {
    ApiService,
    BaMenuService,
    CtmTranslateService,
    SERVER_PATH,
    APPLICATION_VERSION
}                           from "../common";

@Component({
	selector: "screens",
	templateUrl: "./screens.component.html"
})
export class ScreensComponent implements OnInit {
    constructor(
        private api: ApiService,
        private menu: BaMenuService,
        private translate: CtmTranslateService
    ) {
        this.api.callApiController("api/Common/GetScreenMenu", {
            type: "POST"
        }).then((data) => {
            this.menu.updateMenuByRoutes(<Routes>data);
        });
    }

    ngOnInit() {
		
    }

    get applicationVersion() {
        return APPLICATION_VERSION;
    } 
}
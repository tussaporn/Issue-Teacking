import { Injectable }               from "@angular/core";
import {
    CanDeactivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
}                                   from "@angular/router";
import { Observable }               from "rxjs/Observable";

import {
    MESSAGE_DIALOG_TYPE,
    MESSAGE_DIALOG_RETURN_TYPE,
    CONFIRM_CHANGE_SCREEN,
    ConfirmChangeScreen
}                                   from "../common.constant";
import {
    CtmTranslateService,
    CtmMessageService
}                                   from "../services";

@Injectable()
export class ConfirmChangeScreenGuard implements CanDeactivate<ConfirmChangeScreen> {
    constructor(
        private router: Router,

        private message: CtmMessageService,
        private translate: CtmTranslateService        
    ) {
    }

    canDeactivate(
        component: ConfirmChangeScreen,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot

    ): Promise<boolean> | boolean {
        if (!component.confirmChange)
            return true;

        let change = component.confirmChange();
        if (change == CONFIRM_CHANGE_SCREEN.CHANGE) {
            return true;
        }
        else if (change == CONFIRM_CHANGE_SCREEN.CONFIRM_UNSAVE) {
            return this.message.openMessageDialog(
                this.translate.instant("CLC001", "MESSAGE"),
                MESSAGE_DIALOG_TYPE.QUESTION
            )
                .then((type: MESSAGE_DIALOG_RETURN_TYPE) => {
                    if (type == MESSAGE_DIALOG_RETURN_TYPE.YES) {
                        if (component.confirmChangeResult) {
                            component.confirmChangeResult(true);
                        }
                        return true;
                    }

                    if (component.confirmChangeResult) {
                        component.confirmChangeResult(false);
                    }
                    return false;
                })
                .catch((x) => {
                    if (component.confirmChangeResult) {
                        component.confirmChangeResult(false);
                    }
                    return false;
                });
        }

        if (component.confirmChangeResult) {
            component.confirmChangeResult(false);
        }
        return false;
    }
}
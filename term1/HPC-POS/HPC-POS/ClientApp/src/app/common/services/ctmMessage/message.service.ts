import { Injectable }               from "@angular/core";

import { GlobalState }              from "../../../global.state";
import {
    MESSAGE_GLOBAL_KEY, 
    MESSAGE_DIALOG_TYPE,
    MESSAGE_DIALOG_RETURN_TYPE 
}                                   from "../../common.constant";

@Injectable()
export class CtmMessageService {
    private messagePromise: Promise<Object>;

    constructor(
        private global: GlobalState
    ) {
    }

    public openMessageDialog(message: string, type: MESSAGE_DIALOG_TYPE = MESSAGE_DIALOG_TYPE.INFORMATION): Promise<Object> {
        var caller: Function;
        var promise = new Promise((resolve, reject) => {
            caller = resolve;
        });


        if (this.messagePromise != undefined) {
            this.messagePromise.then(() => {
                this.global.notifyDataChanged(MESSAGE_GLOBAL_KEY, {
                    message: message,
                    type: type,
                    caller: caller
                });

                this.messagePromise = promise;
            });
        }
        else {
            this.global.notifyDataChanged(MESSAGE_GLOBAL_KEY, {
                message: message,
                type: type,
                caller: caller
            });

            this.messagePromise = promise;
        }
        
        return promise
            .then((type: MESSAGE_DIALOG_RETURN_TYPE) => {
                this.messagePromise = null;
                return type;
            });
    }
}
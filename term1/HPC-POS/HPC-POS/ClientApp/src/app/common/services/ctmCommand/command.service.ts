import { Injectable }               from "@angular/core";

import { GlobalState }              from "../../../global.state";
import { COMMAND_GLOBAL_BACK }      from "../../common.constant";
import { CtmCommandManagement }     from "../../models";

@Injectable()
export class CtmCommandService {
    constructor(
        private global: GlobalState
    ) {
    }

    public setBackCommand(command: CtmCommandManagement) {
        this.global.notifyDataChanged(COMMAND_GLOBAL_BACK, command);
    }
}
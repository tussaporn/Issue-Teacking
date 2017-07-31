import { Injectable }       from "@angular/core";

import { 
    AScreenParameter
}                           from "../../common";

@Injectable()
export class GroupService extends AScreenParameter {
    public groupID: number;

    public get key() : any {
        return this.groupID;
    }
}
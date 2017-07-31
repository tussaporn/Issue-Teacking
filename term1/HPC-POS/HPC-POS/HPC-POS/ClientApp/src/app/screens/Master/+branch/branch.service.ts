import { Injectable }       from "@angular/core";

import { 
    AScreenParameter
}                           from "../../../common";

@Injectable()
export class BranchService extends AScreenParameter {
    public BranchID: string;

    public get key() : any {
        return this.BranchID;
    }
    public set key(k: any) {
        this.BranchID = k;
    }
}
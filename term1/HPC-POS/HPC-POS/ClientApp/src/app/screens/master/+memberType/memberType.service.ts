import { Injectable }       from "@angular/core";

import { 
    AScreenParameter
}                           from "../../../common";

@Injectable()
export class MemberTypeService extends AScreenParameter {
    public memberTypeID: number;

    public get key() : any {
        return this.memberTypeID;
    }
    public set key(k: any) {
        this.memberTypeID = k;
    }
}
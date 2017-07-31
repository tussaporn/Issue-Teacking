import { Injectable }       from "@angular/core";

import { 
    AScreenParameter
}                           from "../../common";

@Injectable()
export class ProjectService extends AScreenParameter {
    public pj_id: string;

    public get key() : any {
        return this.pj_id;
    }
    public set key(k: any) {
        this.pj_id = k;
    }
}
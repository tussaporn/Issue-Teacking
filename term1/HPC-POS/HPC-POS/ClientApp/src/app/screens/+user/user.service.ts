import { Injectable }       from "@angular/core";

import { 
    AScreenParameter
}                           from "../../common";

@Injectable()
export class UserService extends AScreenParameter {
    public userName: string;

    public get key() : any {
        return this.userName;
    }
    public set key(k: any) {
        this.userName = k;
    }
}
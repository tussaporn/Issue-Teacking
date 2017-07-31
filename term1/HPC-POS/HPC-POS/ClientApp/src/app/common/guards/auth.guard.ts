import { Injectable }                   from "@angular/core";
import { 
    Router, 
    CanActivate, 
    ActivatedRouteSnapshot, 
    RouterStateSnapshot 
}                                       from "@angular/router";
import { 
    Http, 
    Headers, 
    RequestOptions, 
    Response 
}                                       from "@angular/http";

import { 
    SERVER_PATH,
    USER_LOCAL_STORAGE
}                                       from "../common.constant";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private http: Http,
        private router: Router
    ) {         
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let usr;
        let loc = localStorage.getItem(USER_LOCAL_STORAGE);
        if (loc != undefined) {
            usr = JSON.parse(loc);
        }
        if (usr == undefined) {
            this.router.navigate(["/login"],
                {
                    queryParams: { returnUrl: state.url }
                });
            return false;
        }

        return this.http.post(SERVER_PATH + "api/Common/IsAuthenticated", null)
            .toPromise()
            .then((res: Response) => {
                let name = res.text();
                if (name == undefined
                    || name == ""
                    || name != usr.userName) {
                    this.router.navigate(["/login"],
                    {
                        queryParams: { returnUrl: state.url }
                    });

                    return false;
                }

                return true;
            })
            .catch((error: Response) => {
                this.router.navigate(["/login"],
                    {
                        queryParams: { returnUrl: state.url }
                    });
            });
    }
}
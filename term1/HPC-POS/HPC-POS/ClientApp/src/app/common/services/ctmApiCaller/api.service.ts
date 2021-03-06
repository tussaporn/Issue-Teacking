import { Injectable }                       from "@angular/core";
import { 
    Http, 
    Headers, 
    RequestOptions, 
    Response 
}                                           from "@angular/http";
import { Observable }                       from "rxjs/Rx";
import "rxjs/add/operator/toPromise";

import { 
    SERVER_PATH,
    MESSAGE_DIALOG_TYPE,
    MESSAGE_DIALOG_RETURN_TYPE 
}                                           from "../../common.constant";
import { CtmApiSpinner }                    from "../ctmApiSpinner";
import { CtmMessageService }                from "../ctmMessage";

@Injectable()
export class ApiService {
    constructor(
        private http: Http,
        private spinner: CtmApiSpinner,
        private message: CtmMessageService
    ) {
    }

    public callApiController(url: string, option: any = null): Promise<Object> {
        let headers = new Headers({
            "Content-Type": "application/json; charset=UTF-8"
        });
        let options = new RequestOptions({
            "headers": headers,
            //"withCredentials": true 
        });

        let showLoading = true;
        let type = "GET";
        let data = {};
        if (option != undefined) {
            if (option.type != undefined) {
                type = option.type;
            }
            if (option.showLoading != undefined) {
                showLoading = option.showLoading;
            }
            if (option.data != undefined) {
                data = option.data;
            }
        }

        if (showLoading) {
            this.spinner.show();
        }
        if (type == "POST") {
            let _data =JSON.stringify(data);

            return this.http.post(SERVER_PATH + url, _data, options)
                .toPromise()
                .then((res: Response) => {
                    if (showLoading) {
                        this.spinner.hide(500);
                    }
                    
                    return this.extractData(res, this.message);
                })
                .catch((error: Response) => {
                    if (showLoading) {
                        this.spinner.hide(500);
                    }
                    return this.handleError(error, this.message);
                });
        }
        else {
            return this.http.get(SERVER_PATH + url, options)
                .toPromise()
                .then((res: Response) => {
                    if (showLoading) {
                        this.spinner.hide(500);
                    }

                    return this.extractData(res, this.message);
                })
                .catch((error: Response) => {
                    if (showLoading) {
                        this.spinner.hide(500);
                    }

                    return this.handleError(error, this.message);
                });
        }
    }
    public downloadFile(url: string, option: any): Promise<Object> {
        return this.callApiController(url, option)
            .then(
                (result) => {
                    if (result != undefined) {
                        var wind = window.open(SERVER_PATH + "api/Common/Download?f=" + result, "_blank");
                        if (wind != undefined) {
                            wind.focus();
                        }

                        return true;
                    }

                    return false;
                }
            );
    }


    private extractData(res: Response, message: CtmMessageService) {
        let body = res.json();
        if (body != undefined) {
            if (body.HasError == true) {
                return new Promise((resolve, reject) => {
                    var rc = function (idx) {
                        if (idx < body.Messages.length) {
                            var msg = body.Messages[idx];
                            
                            message.openMessageDialog(msg.Message, msg.MessageType)
                                .then((type: MESSAGE_DIALOG_RETURN_TYPE) => {
                                    if (msg.MessageType == MESSAGE_DIALOG_TYPE.QUESTION
                                        || msg.MessageType == MESSAGE_DIALOG_TYPE.QUESTION_WITH_CANCEL) {
                                        if (type == MESSAGE_DIALOG_RETURN_TYPE.YES) {
                                            rc(idx + 1);
                                        }
                                        else {
                                            reject();
                                        }
                                    }
                                    else {
                                        rc(idx + 1);
                                    }
                                });                        
                        }
                        else {
                            resolve();
                        }
                    }
                    rc(0);
                }).then(() => {
                    if (body.Data != undefined) {
                        return body.Data;
                    } 

                    return null;
                }).catch((e) => {
                    return null;
                })
            }
            else if (body.Data != undefined) {
                return body.Data;
            }
        }

        return null;
    }
    private handleError(error: Response, message: CtmMessageService) {
        // In a real world app, we might use a remote logging infrastructure
        if (error instanceof Response) {
            if (error.status == 404) {
                return message.openMessageDialog("404 Not found.");
            }
        }

        return Promise.reject(error);
    }
}
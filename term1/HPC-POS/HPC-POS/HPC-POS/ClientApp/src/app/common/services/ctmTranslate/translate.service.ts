import { Injectable }           from "@angular/core";
import { Http }                 from "@angular/http";
import { 
    LANGUAGES,
    RESOURCES_DATA,
    RESOURCES_PATH
}                               from "../../models"; // import our opaque token

@Injectable()
export class CtmTranslateService {
    public currentLang: string;

    // inject our translations
    constructor(
        private http: Http
    ) {
    }

    public use(lang: string): void {
        // set current language
        this.currentLang = lang;
    }
    public initialResource(): Promise<Object> {
        return new Promise((resolve, reject) => {
            let loadResource = function(http, idx) {
                if (idx >= LANGUAGES.length) {
                    resolve();
                    return;
                }
                                
                let lang = LANGUAGES[idx];
                if (RESOURCES_DATA[lang.name] == undefined) {
                    http.get(`${RESOURCES_PATH}/${lang.name}.json`)
                        .toPromise()
                        .then((res) => {
                            RESOURCES_DATA[lang.name] = res.json();

                            loadResource(http, idx + 1);
                        })
                        .catch(() => {
                            loadResource(http, idx + 1);
                        });
                }
                else {
                    loadResource(http, idx + 1);
                }
            };
            
            loadResource(this.http, 0);
        });
    }
        
    public instant(key: string, module: string) {
        // public perform translation
        return this.translate(key, module);
    }
    public get isLanguageEN() {
        return this.currentLang == "en-US";
    }

    private translate(key: string, module: string): string {
        let translation = key;
        var tran = RESOURCES_DATA[this.currentLang];
        if (tran != undefined) {
            if (module != undefined) {
                var tranf = tran[module];
                if (tranf != undefined) {
                    if (tranf[key] != undefined) {
                        return tranf[key];
                    }
                }
            }
        }

        return translation;
    }
}
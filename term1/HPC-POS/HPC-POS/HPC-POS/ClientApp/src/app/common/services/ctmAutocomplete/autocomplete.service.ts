import { Injectable }               from "@angular/core";

import { 
  AutocompleteData,
  AAutoCompleteCriteria,
  AutocompleteObject,
  AUTOCOMPLETE_CACHE 
}                                   from "../../models";
import { ApiService }               from "../ctmApiCaller";
import { CtmTranslateService }      from "../ctmTranslate";

@Injectable()
export class AutocompleteService {
  constructor (
    private api: ApiService,
    private translate: CtmTranslateService
  ) {    
  }

  public loadData(name: string, criteria: AAutoCompleteCriteria):Promise<any> {
    return new Promise((resolve, reject) => {
      let cache = AUTOCOMPLETE_CACHE[name] as AutocompleteData;
      if (cache != undefined) {
        cache.translate = this.translate;
        
        let alwayLoad = false;
        if (cache.server != undefined) {
          alwayLoad = cache.server.alwayLoad;
        }

        let dataKey = "ROOT";
        if (criteria != undefined) {
          dataKey = criteria.criteriaKey;
        }
        if (cache.data[dataKey] == undefined) {
          cache.data[dataKey] = new AutocompleteObject();
        }
        let obj = cache.data[dataKey] as AutocompleteObject;

        if (alwayLoad != true
            && obj.isLoaded == true) {
          resolve(cache);
        }
        else if (cache.server != undefined) {
          if (obj.isProcessing == true) {
            let wait = function() {
                if (obj.isProcessing == true) {
                  setTimeout(function() {
                    wait();
                  }, 1000);
                }
                else {
                  resolve(cache);
                }
            };
            wait();
          }
          else {
            obj.isProcessing = true;
            this.api.callApiController(cache.server.url, {
              type: "POST",
              data: criteria != undefined? criteria: cache.server.data,
              showLoading: false
            }).then((result) => {
              if (result != undefined) {
                obj.data = result as Array<Object>;
                obj.isLoaded = true;
                obj.isProcessing = false;

                resolve(cache);
              }
            }).catch(() => {
              obj.isProcessing = false;
              resolve(new AutocompleteData());
            })
          }          
        }
        else {
          resolve(new AutocompleteData());
        }
      }
      else {
          resolve(new AutocompleteData());
      }
    });
  }  
}
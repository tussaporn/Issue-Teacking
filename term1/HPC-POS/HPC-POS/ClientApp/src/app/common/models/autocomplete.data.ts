import { CtmTranslateService }      from "../services";
import { cloneObject }              from "../base";

export class AutocompleteItem {
  text: string;
  value: string;
  data: any;

  constructor(source: AutocompleteData, data: any) {
    if (typeof data === 'string') {
      this.text = this.value = data;
      this.data = data;
    }
    if (typeof data === 'object') {
        if (typeof(source.display) == "function") {
          this.text = source.display(source.translate, data);
        }
        else {
          this.text = data[source.display];
        }
        this.value = source.value ? source.returnValue(data[source.value]) : data;
        this.data = cloneObject(data);
    }
  }
}
export class AutoCompleteServer {
  public url: string;
  public data: AAutoCompleteCriteria;
  public alwayLoad: boolean;

  constructor(s: any) {
    if (s != undefined) {
      this.url = s.url;
      this.data = s.data;
      this.alwayLoad = s.alwayLoad? true: false;
    }
  }
}
export abstract class AAutoCompleteCriteria {
  public abstract criteriaKey: string;
}
export class AutocompleteObject {
  public isLoaded: boolean;
  public isProcessing: boolean;
  public data: Array<Object>;
}
export class AutocompleteData {
    public server: AutoCompleteServer;
    public translate: CtmTranslateService;
    public display: any;
    public value: string;
    public data: { };
    public compareValue: Function;
    public returnValue: Function;

    public constructor(
        server: AutoCompleteServer = null,
        display = null, 
        value = null, 
        compareValue: Function = null,
        returnValue: Function = null,
        data = { }, 
        isLoaded = false) {
        
        this.server = server;
        this.display = display;
        this.value = value;
        this.data = data;

        if (compareValue == undefined) {
          this.compareValue = function(val1, val2) {
            return val1 === val2;
          }
        }
        else {
          this.compareValue = compareValue;
        }
        if (returnValue == undefined) {
          this.returnValue = function (val) {
            return val;
          }
        }
        else {
          this.returnValue = returnValue;
        }
    }

    public filter(value, key: AAutoCompleteCriteria, items: Function, custom: Function, equal = false) {
      if (this.data == undefined) {
        return [];
      }

      let k;
      if (key != undefined) {
        k = key.criteriaKey;
      }
      if (k == undefined) {
        k = "ROOT";
      }

      let obj = this.data[k] as AutocompleteObject;
      if (obj == undefined) {
        return [];
      }
      else if (obj.data == undefined) {
        return [];
      }

      let list = obj.data;
      if (items != undefined) {
        list = items(list);
      }
      
      return list.map((i: any) => {
        let pass = true;
        if (custom != undefined) {
          pass = custom(i);
        }
        if (pass) {
          return new AutocompleteItem(this, i);
        }
      }).filter(i => {
        if (i == undefined) {
          return false;
        }
          
        if (equal == true) {
          return new RegExp("^" + value + "$", 'ig').test(i.text);
        }
        else {
          return new RegExp(value, 'ig').test(i.text);
        }
      });
    }
    public find(value, key: AAutoCompleteCriteria, items: Function) {
      if (this.data == undefined) {
        return new AutocompleteItem(this, "");
      }

      let k;
      if (key != undefined) {
        k = key.criteriaKey;
      }
      if (k == undefined) {
        k = "ROOT";
      }
      
      let obj = this.data[k] as AutocompleteObject;
      if (obj == undefined) {
        return new AutocompleteItem(this, "");
      }
      else if (obj.data == undefined) {
        return new AutocompleteItem(this, "");
      }

      let list = obj.data;
      if (items != undefined) {
        list = items(list);
      }
      let selItm = list.find((i: any) => {
        return this.equals(this.value ?
                i[this.value] : i, value)
                || this.compareValue(this.value ?
                    i[this.value] : i, value)
        });
      if (selItm == undefined) {
        selItm = "";
      }
        
      return new AutocompleteItem(this, selItm);
    }

    /**
   * Compare two vars or objects
   * @param o1 compare first object
   * @param o2 compare second object
   * @return boolean comparation result
   */
  private equals(o1: any, o2: any) {
    if (o1 === o2) { return true; }
    if (o1 === null || o2 === null) { return false; }
    if (o1 !== o1 && o2 !== o2) { return true; }
    let t1 = typeof o1, t2 = typeof o2, key: any, keySet: any;
    if (t1 === t2 && t1 === 'object') {
      keySet = Object.create(null);
      for (key in o1) {
        if (!this.equals(o1[key], o2[key])) { return false; }
        keySet[key] = true;
      }
      for (key in o2) {
        if (!(key in keySet) && key.charAt(0) !== '$' && o2[key]) { return false; }
      }
      return true;
    }
    return false;
  }
}
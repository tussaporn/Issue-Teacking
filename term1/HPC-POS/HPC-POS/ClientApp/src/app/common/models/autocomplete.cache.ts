import {
    convertBoolean,
    convertNumber
}                                   from "../base";
import { 
    AutocompleteData,
    AutoCompleteServer,
    AAutoCompleteCriteria 
}                                   from "./autocomplete.data";
import { CtmTranslateService }      from "../services";

export class TheatreSubAutoCompleteCriteria 
                extends AAutoCompleteCriteria {
    public TheatreID: number;
    
    public get criteriaKey(): string {
        let key = "";
        if (this.TheatreID != undefined) {
            key = this.TheatreID.toString();
        }

        return key;
    }
}
export class TheatreSystemAutoCompleteCriteria 
                extends AAutoCompleteCriteria {
    public TheatreID: number;
    public TheatreSubID: number;

    public get criteriaKey(): string {
        let key = "";
        if (this.TheatreID != undefined) {
            key = this.TheatreID.toString();

            if (this.TheatreSubID != undefined) {
                key = ":" + this.TheatreSubID.toString();
            }
        }

        return key;
    }
}

export const AUTOCOMPLETE_CACHE = {
    "GROUP": new AutocompleteData(
                new AutoCompleteServer({
                    url: "api/Common/GetUserGroupAutoComplete",
                    alwayLoad: true
                }),
                (translate: CtmTranslateService, data)=> { 
                    if (translate.isLanguageEN == true) {
                        return data["NameEN"];
                    }
                    
                    return data["NameLC"];
                },
                "GroupID"),
    "USER": new AutocompleteData(
                new AutoCompleteServer({
                    url: "api/Common/GetUserAutoComplete"
                }),
                "UserName",
                "UserName"),
    "ACTIVE_STATUS": new AutocompleteData(
                new AutoCompleteServer({
                    url: "api/Common/GetConstantAutoComplete",
                    data: { ConstantCode: "ACTIVE_STATUS" }
                }),
                (translate: CtmTranslateService, data)=> { 
                    if (translate.isLanguageEN == true) {
                        return data["NameEN"];
                    }
                    
                    return data["NameLC"];
                },
                "ConstantValue",
                function(val1, val2) {                    
                  return convertBoolean(val1) == convertBoolean(val2);
                },
                function (val) {
                    return convertBoolean(val);
                }),
    "DISPLAY_PAGE": new AutocompleteData(
                new AutoCompleteServer({
                    url: "api/Common/GetConstantAutoComplete",
                    data: { ConstantCode: "DISPLAY_PAGE" }
                }),
                "NameEN",
                "ConstantValue",
                function(val1, val2) {
                  return convertNumber(val1) == convertNumber(val2);
                },
                function (val) {
                    return convertNumber(val);
                }),
    "GENDER": new AutocompleteData(
                new AutoCompleteServer({
                    url: "api/Common/GetConstantAutoComplete",
                    data: { ConstantCode: "GENDER" }
                }),
                (translate: CtmTranslateService, data)=> { 
                    if (translate.isLanguageEN == true) {
                        return data["NameEN"];
                    }
                    
                    return data["NameLC"];
                },
                "ConstantValue"),

      "SMALL_MASTER": new AutocompleteData(
                new AutoCompleteServer({
                    url: "api/Master/GetSmallMasterAutoComplete"
                }),
                (translate: CtmTranslateService, data)=> { 
                    if (translate.isLanguageEN == true) {
                        return data["MSTNameEN"];
                    }
                        return data["MSTNameLC"];
                },
                "MSTCode"),
    "Discount_Value": new AutocompleteData(
                new AutoCompleteServer({
                    url: "api/Master/GetMemberTypeDiscount"
                }),
                "DiscountValueText",
                "DiscountValue"),
    "Discount_Type": new AutocompleteData(
                new AutoCompleteServer({
                    url: "api/Master/GetMSTCodeAutocomplete",
                    data: { MSTCode: "070" }
                }),
                "Value2",                
                "ValueCode"),
    "MemberLifeType": new AutocompleteData(
                new AutoCompleteServer({
                    url: "api/Master/GetMSTCodeAutocomplete",
                    alwayLoad: true,
                    data: { MSTCode: "MTA" }
                }),
                (translate: CtmTranslateService, data)=> { 
                    if (translate.isLanguageEN == true) {
                        return data["Value1"];
                    }
                        return data["Value2"];
                },
                "ValueCode"
                ,function(val1, val2) {
                  return convertNumber(val1) == convertNumber(val2);
                },
                function (val) {
                    return convertNumber(val);
                }),
    "CashDiscount_Type": new AutocompleteData(
                new AutoCompleteServer({
                    url: "api/Master/GetMSTCodeAutocomplete",
                    data: { MSTCode: "070" }
                }),
                "Value2",                
                "ValueCode"),
    "CreditDiscount_Type": new AutocompleteData(
                new AutoCompleteServer({
                    url: "api/Master/GetMSTCodeAutocomplete",
                    data: { MSTCode: "070" }
                }),
                "Value2",                
                "ValueCode")
    


};
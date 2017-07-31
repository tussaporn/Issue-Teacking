import { 
    Pipe, 
    PipeTransform 
}                                   from "@angular/core";

import { CtmTranslateService }      from "../../services"; // our translate service

@Pipe({
    name: "translate",
    pure: false // impure pipe, update value when we change language
})

export class CtmTranslatePipe implements PipeTransform {
    constructor(
        private translate: CtmTranslateService
    ) { 
        
    }

    transform(value: string, module: string): any {
        if (!value) return;

        return this.translate.instant(value, module);
    }
}
import { 
  Pipe, 
  PipeTransform
}                             from "@angular/core";
import { layoutPaths }        from "../../common.constant";
import { textDateLocale }     from "../../base";

@Pipe({ name: "ctmDate" })
export class CtmDatePipe implements PipeTransform {

  transform(value: Date, format = "DD/MM/YYYY", locale = null):string {
    return textDateLocale(value, format, locale);
  }
}

import { 
  Pipe, 
  PipeTransform
}                             from "@angular/core";
import { layoutPaths }        from "../../common.constant";
import { textNumeric }     from "../../base";

@Pipe({ name: "ctmNumeric" })
export class CtmNumericPipe implements PipeTransform {

  transform(value: Number, option = null):string {
    return textNumeric(value, option);
  }
}

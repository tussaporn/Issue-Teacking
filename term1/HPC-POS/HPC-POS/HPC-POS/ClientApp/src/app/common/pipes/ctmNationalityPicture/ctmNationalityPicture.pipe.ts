import { 
  Pipe, 
  PipeTransform
}                         from "@angular/core";
import { layoutPaths }    from "../../common.constant";

@Pipe({ name: "ctmNationalityPicture" })
export class CtmNationalityPicturePipe implements PipeTransform {

  transform(input:string, ext = "png"):string {
    if (input != undefined) {
      return layoutPaths.images.nationality + input + "." + ext;
    }

    return "";
  }
}

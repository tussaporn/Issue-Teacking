import { 
  Pipe, 
  PipeTransform
}                         from "@angular/core";
import { layoutPaths }    from "../../common.constant";

@Pipe({ name: "baProfilePicture" })
export class BaProfilePicturePipe implements PipeTransform {

  transform(input:string, ext = "png"):string {
    return layoutPaths.images.profile + input + "." + ext;
  }
}

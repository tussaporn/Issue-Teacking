import {
  Component, 
  ElementRef, 
  HostListener
}                               from "@angular/core";

import { GlobalState }          from "../../../global.state";
import {
  MENU_GLOBAL_COLLAPSED,
  OFFSET_SIDEBAR_HEIGHT, 
  layoutSizes 
}                               from "../../common.constant";

import "style-loader!./baSidebar.scss";

@Component({
  selector: "ba-sidebar",
  templateUrl: "./baSidebar.html"
})
export class BaSidebar {
  public menuHeight:number;
  public isMenuCollapsed:boolean = true;
  public isMenuShouldCollapsed:boolean = false;

  constructor(
    private elementRef: ElementRef, 
    private global: GlobalState
  ) {
    this.global.subscribe(MENU_GLOBAL_COLLAPSED, (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

}

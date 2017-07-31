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

  public ngOnInit():void {
    if (this._shouldMenuCollapse()) {
      this.menuCollapse();
    }
  }

  public ngAfterViewInit():void {
    setTimeout(() => this.updateSidebarHeight());
  }

  @HostListener("window:resize")
  public onWindowResize():void {
    var isMenuShouldCollapsed = this._shouldMenuCollapse();

    if (this.isMenuShouldCollapsed !== isMenuShouldCollapsed) {
      this.menuCollapseStateChange(isMenuShouldCollapsed);
    }
    this.isMenuShouldCollapsed = isMenuShouldCollapsed;
    this.updateSidebarHeight();
  }

  public menuExpand():void {
    this.menuCollapseStateChange(false);
  }

  public menuCollapse():void {
    this.menuCollapseStateChange(true);
  }

  public menuCollapseStateChange(isCollapsed:boolean):void {
    this.isMenuCollapsed = isCollapsed;
    this.global.notifyDataChanged(MENU_GLOBAL_COLLAPSED, this.isMenuCollapsed);
  }

  public updateSidebarHeight():void {
    // TODO: get rid of magic 84 constant
    this.menuHeight = this.elementRef.nativeElement.childNodes[0].clientHeight - OFFSET_SIDEBAR_HEIGHT;
  }

  private _shouldMenuCollapse():boolean {
    return window.innerWidth <= layoutSizes.resWidthCollapseSidebar;
  }
}

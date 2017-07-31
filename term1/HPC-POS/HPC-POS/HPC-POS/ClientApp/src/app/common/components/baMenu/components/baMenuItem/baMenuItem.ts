import {
  Component, 
  Input, 
  Output, 
  EventEmitter
}                                   from "@angular/core";
import {
  Router
}                                   from "@angular/router";

import { 
  GlobalState 
}                                   from "../../../../../global.state";

import { 
  MENU_GLOBAL_COLLAPSED 
}                                   from "../../../../common.constant";

import { 
  BaThemeSpinner,
  CtmTranslateService
}                                   from "../../../../services";

import "style-loader!./baMenuItem.scss";

@Component({
  selector: "ba-menu-item",
  templateUrl: "./baMenuItem.html"
})
export class BaMenuItem {
  @Input() menuItem:any;
  @Input() child:boolean = false;

  @Output() itemHover = new EventEmitter<any>();
  @Output() toggleSubMenu = new EventEmitter<any>();

  constructor(
    private router: Router,
    
    private global: GlobalState,
    private translate: CtmTranslateService,
    private spinner: BaThemeSpinner
  ) {
  
  }

  public onHoverItem($event):void {
    this.itemHover.emit($event);
  }

  public onToggleSubMenu($event, item):boolean {
    $event.item = item;
    this.toggleSubMenu.emit($event);
    return false;
  }

  public titleByLanguage(item) {
      if (this.translate.isLanguageEN)
          return item.titleEN;

      return item.titleLC;
  }

  private onMenuItemClick(menuItem) {
    if (!menuItem.children && !menuItem.url) {
      if (menuItem.route.paths != this.router.url) {
        //this.spinner.show();
        this.global.notifyDataChanged(MENU_GLOBAL_COLLAPSED, true); 
        
      }

      this.router.navigate(menuItem.route.paths);
      return false;
    }
    else {
      //this.spinner.show();
    }
  }
}

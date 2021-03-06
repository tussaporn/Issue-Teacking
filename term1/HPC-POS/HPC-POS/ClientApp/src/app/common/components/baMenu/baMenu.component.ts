import { 
  Component, 
  Input, 
  Output, 
  EventEmitter 
}                                     from "@angular/core";
import { 
  Router, 
  NavigationEnd 
}                                     from "@angular/router";
import { Subscription }               from "rxjs/Rx";

import { BaMenuService }              from "../../services";
import { GlobalState }                from "../../../global.state";
import { 
  MENU_GLOBAL_ACTIVELINK,
  OFFSET_MENU_ITEM_HOVER 
}                                     from "../../common.constant";

import "style-loader!./baMenu.scss";

@Component({
  selector: "ba-menu",
  templateUrl: "./baMenu.html"
})
export class BaMenu {

  @Input() sidebarCollapsed: boolean = false;
  @Input() menuHeight: number;

  @Output() expandMenu = new EventEmitter<any>();

  public menuItems: any[];
  protected _menuItemsSub: Subscription;
  public showHoverElem: boolean;
  public hoverElemHeight: number;
  public hoverElemTop: number;
  protected _onRouteChange: Subscription;
  public outOfArea: number = -200;

  constructor(
    private router: Router, 
    private service: BaMenuService, 
    private global: GlobalState) {
  }

  public updateMenu(newMenuItems) {
    this.menuItems = newMenuItems;
    this.selectMenuAndNotify();
  }

  public selectMenuAndNotify(): void {
    this.service.clearCurrentItem();
      
    if (this.menuItems) {
      this.menuItems = this.service.selectMenuItem(this.menuItems);
      this.global.notifyDataChanged(MENU_GLOBAL_ACTIVELINK, this.service.getCurrentItem());
    }
  }

  public ngOnInit(): void {
    this._onRouteChange = this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        if (this.menuItems) {
          this.selectMenuAndNotify();
        } else {
          // on page load we have to wait as event is fired before menu elements are prepared
          setTimeout(() => this.selectMenuAndNotify());
        }
      }
    });

    this._menuItemsSub = this.service.menuItems.subscribe(this.updateMenu.bind(this));
  }

  public ngOnDestroy(): void {
    this._onRouteChange.unsubscribe();
    this._menuItemsSub.unsubscribe();
  }

  public hoverItem($event): void {
    this.showHoverElem = true;
    this.hoverElemHeight = $event.currentTarget.clientHeight;
    // TODO: get rid of magic 66 constant
    this.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - OFFSET_MENU_ITEM_HOVER;
  }

  public toggleSubMenu($event): boolean {
    let submenu = jQuery($event.currentTarget).next();

    if (this.sidebarCollapsed) {
      this.expandMenu.emit(null);
      if (!$event.item.expanded) {
        $event.item.expanded = true;
      }
    } else {
      $event.item.expanded = !$event.item.expanded;
      submenu.slideToggle();
    }

    return false;
  }
}

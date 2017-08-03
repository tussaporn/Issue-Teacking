import { Component }                from "@angular/core";
import {
    Router,
    ActivatedRoute
}                                   from "@angular/router";

import { GlobalState }              from "../../../global.state";
import { 
    MENU_GLOBAL_COLLAPSED,
    MESSAGE_DIALOG_TYPE,
    MESSAGE_DIALOG_RETURN_TYPE,
    USER_LOCAL_STORAGE,
    SERVER_PATH 
}                                   from "../../common.constant"; 
import {
    CtmTranslateService,
    CtmMessageService
}                                   from "../../services";

import "style-loader!./baPageTop.scss";

@Component({
  selector: "ba-page-top",
  templateUrl: "./baPageTop.html",
})
export class BaPageTop {
  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = true;

  constructor(
      private route: ActivatedRoute,
      private router: Router,

      private global: GlobalState,
      private translate: CtmTranslateService,
      private message: CtmMessageService
  ) {
    this.global.subscribe(MENU_GLOBAL_COLLAPSED, (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this.global.notifyDataChanged(MENU_GLOBAL_COLLAPSED, this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  private get currentUserName() {
      let loc = localStorage.getItem(USER_LOCAL_STORAGE);
      if (loc != undefined) {
        let usr = JSON.parse(loc);
        if (usr != undefined) {
          return usr.displayName;
        }
      }

      return "";
  }
  private get currentLanguage() {
    return this.translate.isLanguageEN ? "united-states": "thailand";
  }

  private onChangeLanguage(lang) {
    if ((this.translate.isLanguageEN && lang != "en-US")
        || (!this.translate.isLanguageEN && lang != "th-TH")){
      let url = window.location.href;
      window.location.href = SERVER_PATH + "api/Common/SetLanguage?culture=" + lang + "&returnUrl=" + url;
    }
  
    return false; 
  }
  private onLogout() {
    this.message.openMessageDialog(
      this.translate.instant("CLC002", "MESSAGE"),
      MESSAGE_DIALOG_TYPE.QUESTION
    ).then((type: MESSAGE_DIALOG_RETURN_TYPE) => {
      if (type == MESSAGE_DIALOG_RETURN_TYPE.YES) {
        this.router.navigate(["/login"]);
      }
    });

    return false;
  }
  private onShowUserInfo(){
    this.router.navigate(["/s/userinfo"]);
  }
}

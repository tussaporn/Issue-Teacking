import {
  Component, 
  Input,
  HostListener,
  ElementRef
}                             from "@angular/core";

import { DISPLAY_PAGE }       from "../../common.constant";
import { 
  textFormat,
  textNumeric
}                             from "../../base";
import {
  CtmTableData
}                             from "../../models";
import {
  CtmTranslateService  
}                             from "../../services"

@Component({
  selector: "ctm-table",
  templateUrl: "./table.component.html",
})
export class CtmTable {
    private _showInformation: boolean = true
    private _showDisplayPage: boolean = true;
    private _showPagging: boolean = true;
    private _tableStriped: boolean = true;
    private _fixedHeader: boolean = false;

    constructor(
      private _element: ElementRef,
      private translate: CtmTranslateService
    ) {
    }

    @HostListener("window:resize")
  public onWindowResize():void {
    this.setTableHeader();
  }
  
  @HostListener("window:scroll")
  public onWindowScroll():void {
    this.setTableHeader();
  }

    @Input("show-information")
    public get showInformation(): boolean {
        return this._showInformation;
    }
    public set showInformation(display: boolean) {
        this._showInformation = display;
    }

    @Input("show-display-page")
    public get showDisplayPage(): boolean {
        return this._showDisplayPage;
    }
    public set showDisplayPage(display: boolean) {
        this._showDisplayPage = display;
    }

    @Input("show-pagging")
    public get showPagging(): boolean {
        return this._showPagging;
    }
    public set showPagging(pagging: boolean) {
        this._showPagging = pagging;
    }

    @Input("table-data")
    public tableData: CtmTableData;

    @Input("table-hover")
    public tableHover: boolean = true;

    @Input("table-striped")
    public get tableStriped(): boolean {
        return this._tableStriped;
    }
    public set tableStriped(s: boolean) {
        this._tableStriped = s;
    }
    
    @Input("table-fixed-header")
    public tableFixedHeader: boolean = false;

    private _onDisplayPageChange(data) {
        this.tableData.pageNumber = 1;
        this.tableData.loadData(null);
    }
    private _onPageChange(page) {
      if (page.current)
        return;

      this.tableData.pageNumber = page.number;
      this.tableData.loadData(null);
    }

    private _tableInformation() {
      let info = "";
      if (this.tableData.totalRecords > 0) {
        if (this.showPagging == true) {
          info = textFormat(
            this.translate.instant("tableRecordInfo", "COMMON"),
            [
              textNumeric(this.tableData.pagging.from, { comma: true }),
              textNumeric(this.tableData.pagging.to, { comma: true }),
              textNumeric(this.tableData.totalRecords, { comma: true })
            ]);
        }
        else {
          info = textFormat(
            this.translate.instant("tableRecordInfoNoPaging", "COMMON"),
            [
              textNumeric(this.tableData.totalRecords, { comma: true })
            ]);
        }
      }

      return info;
    }

    private setTableHeader() {
      if (this.tableFixedHeader) { 
        let mCtrl = this._element.nativeElement.querySelector('.table-main');
        let hCtrl = this._element.nativeElement.querySelector('.table-fixed-header');

        let top = 0, c;
        c = mCtrl;
        do {
            top += c.offsetTop  || 0;
            c = c.offsetParent;
        } while(c);

        let ptop = $(document.body).find(".page-top").outerHeight();
        
        let height = $(mCtrl).outerHeight();
        let scroll = (document.body.scrollTop + ptop);

        if ((scroll < (top + height - 40)) && (top - scroll < 0)) {
          this._fixedHeader = true;

          let mscroll = $(mCtrl)
          let hscroll = $(hCtrl);
          let mheader = mscroll.find("table");
          let header = hscroll.find("table");

          mscroll.unbind("scroll");
          mscroll.bind("scroll", function() {
            setTimeout(function() {
                 hscroll.scrollLeft(mscroll.scrollLeft());
            }, 10);
          });
          
          hscroll.unbind("scroll");
          hscroll.bind("scroll", function() {
            setTimeout(function() {
                 mscroll.scrollLeft(hscroll.scrollLeft());
            }, 10);
          });

          hscroll.css({ 
            top: ptop + "px",
            width: mscroll.width() + "px" 
          });
          hscroll.scrollLeft(mscroll.scrollLeft());
          
          header.width(mheader.width());
          header.empty();
          header.append(mheader.find("colgroup").clone());
          header.append(mheader.find("thead").clone());
        }
        else {
          this._fixedHeader = false;
        }
      }
    }
 }
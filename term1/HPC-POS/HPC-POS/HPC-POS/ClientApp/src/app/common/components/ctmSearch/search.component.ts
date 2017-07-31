import {
  Component,
  Input,
  Output,
  EventEmitter
}                           from "@angular/core";

import "style-loader!./search.component.scss";

@Component({
  selector: "ctm-search-criteria",
  templateUrl: "search.component.html"
})
export class CtmSearchCriteria {
    constructor(
    ) { 

    }

    @Input("use-search-command")
    public useSearchCommand: boolean;
    @Input("use-clear-command")
    public useClearCommand: boolean;
    
    @Output("search-command")
    public searchCommand: EventEmitter<any> = new EventEmitter();
    @Output("clear-command")
    public clearCommand: EventEmitter<any> = new EventEmitter();
    
    private onSearchClick() {
        if (this.searchCommand != undefined) {
            this.searchCommand.emit();
        }
    }
    private onClearClick() {
        if (this.clearCommand != undefined) {
            this.clearCommand.emit();
        }
    }
}
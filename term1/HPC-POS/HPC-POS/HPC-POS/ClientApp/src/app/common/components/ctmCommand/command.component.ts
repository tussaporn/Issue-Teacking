import {
  Component,
  Input,
  Output,
  EventEmitter
}                           from "@angular/core";
import { Location }         from "@angular/common";

import "style-loader!./command.component.scss";

@Component({
  selector: "ctm-screen-command",
  templateUrl: "command.component.html"
})
export class CtmScreenCommand {
    constructor(
        private _location: Location
  ) { 

    }

	@Input("use-export-command")
	public useExportCommand: boolean;
    @Input("use-add-command")
    public useAddCommand: boolean;
    @Input("use-edit-command")
    public useEditCommand: boolean;
    @Input("use-delete-command")
    public useDeleteCommand: boolean;
    @Input("use-update-command")
    public useUpdateCommand: boolean;
    @Input("use-cancel-command")
    public useCancelCommand: boolean;
    
    @Input("use-custom-command")
    public useCustomCommand: boolean;

	public exportCommandDisabled: boolean = true;
    public addCommandDisabled: boolean = true;
    public editCommandDisabled: boolean = true;
    public deleteCommandDisabled: boolean = true;
    public updateCommandDisabled: boolean = true;
    public cancelCommandDisabled: boolean = true;

	@Output("export-command")
	public exportCommand: EventEmitter<any> = new EventEmitter();
    @Output("add-command")
    public addCommand: EventEmitter<any> = new EventEmitter();
    @Output("edit-command")
    public editCommand: EventEmitter<any> = new EventEmitter();
    @Output("delete-command")
    public deleteCommand: EventEmitter<any> = new EventEmitter();
    @Output("update-command")
    public updateCommand: EventEmitter<any> = new EventEmitter();
    @Output("cancel-command")
    public cancelCommand: EventEmitter<any> = new EventEmitter();

	private onExportClick() {
		if (this.exportCommand != undefined) {
			this.exportCommand.emit();
		}
	};
    private onAddClick() {
        if (this.addCommand != undefined) {
            this.addCommand.emit();
        }
    };
    private onEditClick() {
        if (this.editCommand != undefined) {
            this.editCommand.emit();
        }
    };
    private onDeleteClick() {
        if (this.deleteCommand != undefined) {
            this.deleteCommand.emit();
        }
    };
    private onUpdateClick() {
        if (this.updateCommand != undefined) {
            this.updateCommand.emit();
        }
    };
    private onCancelClick() {
        if (this.cancelCommand != undefined) {
            this.cancelCommand.emit();
        }
    };

  private get hasCommandEvent() {
	  return this.useExportCommand
		  || this.useAddCommand
          || this.useEditCommand
          || this.useDeleteCommand
          || this.useUpdateCommand
          || this.useCancelCommand;
  }
}
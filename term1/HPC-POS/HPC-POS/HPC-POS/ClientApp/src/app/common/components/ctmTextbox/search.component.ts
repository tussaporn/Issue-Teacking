import {
  AfterContentInit,
  Component,
  ViewEncapsulation,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  forwardRef
}                           from "@angular/core";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR  
}                           from "@angular/forms";

import { ResponseMessage }  from "../../models";

export const CTM_SEARCH_TEXTBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CtmSearchTextbox),
  multi: true
};

@Component({
  selector: "ctm-search-textbox",
  templateUrl: "search.component.html",
  providers: [CTM_SEARCH_TEXTBOX_CONTROL_VALUE_ACCESSOR],
  host: {   
  },
  encapsulation: ViewEncapsulation.None
})
export class CtmSearchTextbox implements ControlValueAccessor {

  constructor(
      private _element: ElementRef
  ) { 

  }

  private _value: any = "";
  private _readonly: boolean = false;
  private _disabled: boolean = false;
  private _error: ResponseMessage = new ResponseMessage();
  private _inputFocused: boolean = false;

  _onChange = (value: any) => { };
  _onTouched = () => { };

  @Input()
  tabindex: number = 0;
  @Input() 
  placeholder: string = null;
  @Input("minlength") 
  minLength: number = 0;
  @Input("maxlength")
  maxLength: number = 100;

  @Input()
  get readonly(): boolean { 
      return this._readonly; 
  }
  set readonly(value) { 
      this._readonly = value; 
  }

  @Input()
  get disabled(): boolean { 
      //return this._disabled; 
      return this._readonly;
  }
  set disabled(value) { 
      //this._disabled = value; 
      this._readonly = value;
  }

  @Input()
  get error(): ResponseMessage { 
      return this._error; 
  }
  set error(value) {
    if (value != undefined) {
      if (typeof(value) == "string") {
        this._error = new ResponseMessage();
        this._error.type = "error";
        this._error.message = value;
      }
      else {
        this._error = value;
      } 
    }
  }

  @Input()
  get value(): any { return this._value; }
  set value(value: any)  {
    this._value = value;    
    this._onChange(value);
  }

  @Output("search-command")
  public searchCommand: EventEmitter<any> = new EventEmitter();

  writeValue(value: any): void {
    if (value !== this._value) {
      this._value = value;
    }
  }

  registerOnChange(fn: (value: any) => void): void { this._onChange = fn; }

  registerOnTouched(fn: () => {}): void { this._onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private onKeypress(event) {
    if (event.keyCode == 13) {
      this.onSearch();
      return false;
    }
  }
  private onChange() {
    this._error = new ResponseMessage();
  }
  private onFocus() {
    if (this._disabled == false
        && this._readonly == false
        && this._value != undefined) {
      this._inputFocused = true;

      let input = this._element.nativeElement.querySelector('input');
      setTimeout(function() {
        input.select();
      }, 0);
    }
  }
  private onBlur() {
    this._inputFocused = false;
    this._onTouched();
  } 

  public focus() {
    this._element.nativeElement.querySelector('input').focus();
  }

  private onSearch() {   
    if (this.searchCommand != undefined) {
      this.searchCommand.emit({
        value: this.value
      });
    } 
  }
}
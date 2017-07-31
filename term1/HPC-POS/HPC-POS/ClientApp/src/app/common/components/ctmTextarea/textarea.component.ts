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

export const CTM_TEXTAREA_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CtmTextarea),
  multi: true
};

import "style-loader!./textarea.component.scss";

@Component({
  selector: "ctm-textarea",
  templateUrl: "textarea.component.html",
  providers: [CTM_TEXTAREA_CONTROL_VALUE_ACCESSOR],
  host: {   
  },
  encapsulation: ViewEncapsulation.None
})
export class CtmTextarea implements ControlValueAccessor {

  constructor(
      private _element: ElementRef
  ) { 

  }

  private _value: any = "";
  private _readonly: boolean = false;
  private _disabled: boolean = false;
  private _error: ResponseMessage = new ResponseMessage();
  
  _onChange = (value: any) => { };
  _onTouched = () => { };

  @Input("type")
  textType: string = "text";

  @Input()
  tabindex: number = 0;
  @Input() 
  placeholder: string = null;
  @Input("minlength") 
  minLength: number = 0;
  @Input("maxlength")
  maxLength: number = 100;
  @Input("rows")
  rows: number = 4;

  @Input()
  get readonly(): boolean { 
      return this._readonly; 
  }
  set readonly(value) { 
      this._readonly = value; 
  }

  @Input()
  get disabled(): boolean { 
      return this._disabled; 
  }
  set disabled(value) { 
      this._disabled = value; 
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

  _onChangeEvent() {
    this._error = new ResponseMessage();
  }
  _onBlurEvent() {
    this._onTouched();
  } 

  get textareaRows() {
      if (this.rows == 14) {
        return "textarea--row14";
      }

      return "textarea--row4";
  }

  private onFocus() {
	  if (this._disabled == false
		  && this._readonly == false
		  && this._value != undefined) {
		  let input = this._element.nativeElement.querySelector('textarea');
		  setTimeout(function () {
			  input.select();
		  }, 0);
	  }
  }
}
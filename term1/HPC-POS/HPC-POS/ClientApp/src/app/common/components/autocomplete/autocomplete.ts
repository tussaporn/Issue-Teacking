import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewEncapsulation,
  NgModule,
  ModuleWithProviders,
  HostListener,

  ViewChild,
  Directive,
  TemplateRef,
  ViewContainerRef

} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { 
  CommonModule
 } from '@angular/common';

import { HighlightPipe } from './autocomplete-pipe';
import {
  coerceBooleanProperty,
  UP_ARROW,
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  TAB,

  TemplatePortalDirective,
  Overlay,
  OverlayRef,
  OverlayState,

  OverlayModule, 
  CompatibilityModule,
  PlatformModule

} from '../../base';

import {
  Md2Tooltip,
  Md2TooltipComponent
}   from "../tooltip";

import {
  cloneObject
}                           from "../../base";
import { 
  ResponseMessage,
  AutocompleteItem,
  AutocompleteData,
  AAutoCompleteCriteria
}                           from "../../models";
import {
  AutocompleteService
}                           from "../../services";

let nextId = 0;
export const MD2_AUTOCOMPLETE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Md2Autocomplete),
  multi: true
};

/** Change event object emitted by Md2Autocomplete. */
export class Md2AutocompleteChange {
  source: Md2Autocomplete;
  value: any
}

@Component({
  selector: 'md2-autocomplete',
  templateUrl: 'autocomplete.html',
  styleUrls: ['./autocomplete.scss'],
  providers: [MD2_AUTOCOMPLETE_CONTROL_VALUE_ACCESSOR],
  host: {
    'role': 'autocomplete',
    '[id]': 'id',
    '[attr.aria-label]': 'placeholder',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[class.md2-autocomplete-disabled]': 'disabled',
  },
  encapsulation: ViewEncapsulation.None,
  exportAs: 'md2Autocomplete'
})

export class Md2Autocomplete implements AfterContentInit, ControlValueAccessor {
  @ViewChild("divAutocomplete") divAutocomplete;

  private positionTop: number = 0;
  private positionLeft: number = 0;
  private width: number = 0;

  constructor(
    private _element: ElementRef,
    private _autocomplete: AutocompleteService
  ) {
  }


  ngOnInit() {
    let container = document.createElement('div');
    container.classList.add("autocomplete-container");
    container.appendChild(this.divAutocomplete.nativeElement);
    document.body.appendChild(container);
  }

  @HostListener("window:resize")
  public onWindowResize():void {
    this.updatePosition();
  }
  
  @HostListener("window:scroll")
  public onWindowScroll():void {
    this.updatePosition();
  }
  
  ngAfterContentInit() {
    this._isInitialized = true; 
  }

  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() textChange = new EventEmitter();

  private _value: any = '';
  private _defaultValue: any = null;
  private _readonly: boolean = false;
  private _required: boolean = false;
  private _disabled: boolean = false;
  private _isInitialized: boolean = false;
  private _error: ResponseMessage = new ResponseMessage();
  private _btnShowMenu: boolean = false;
  
  private _key: string;
  private _autocompleteData: AutocompleteData = new AutocompleteData();
  private _autocompletePlaceHolder: string = "SELECT";
  private _isLoading: boolean = false;
  private _criteria: AAutoCompleteCriteria;

  _onChange = (value: any) => { };
  _onTouched = () => { };

  _list: Array<AutocompleteItem> = [];

  private selectedItem: AutocompleteItem = null;
  private noBlur: boolean = false;
  _focusedOption: number = 0;
  _inputValue: string = '';
  _inputFocused: boolean = false;
  _triggerClick: boolean = false;
  
  @Input() id: string = 'md2-autocomplete-' + (++nextId);
  @Input() tabindex: number = 0;
  @Input('min-length') minLength: number = 1;

  @Input("autocomplete-key")
  get key(): string {
    return this._key;
  }
  set key(k) {
    this._key = k;
    this._isLoading = true;
    this._autocompleteData = new AutocompleteData();
    this._autocomplete.loadData(this._key, this._criteria)
      .then(res => {
        this._autocompleteData = res;
        this._isLoading = false;

        if (this._value != undefined) {
          let selectedItem = this._autocompleteData.find(this._value, this._criteria, this.customItems);
          if (selectedItem) {
              this.selectedItem = selectedItem;
              this._inputValue = this.selectedItem.text;
              this._value = this.selectedItem ? this.selectedItem.value : this.selectedItem;

              if (this.isMenuVisible == true) {                  
                this._list = this._autocompleteData.filter(this._inputValue, this._criteria, this.customItems, this.customFilter);
              }
          }          
        }
      });
  }

  @Input("autocomplete-placeholder")
  get autocompletePlaceHolder(): string {
    return this._autocompletePlaceHolder;
  }
  set autocompletePlaceHolder(type: string) {
    this._autocompletePlaceHolder = type;
  }

  @Input("autocomplete-default-value")
  get autocompleteDefaultValue(): any {
    return this._defaultValue;
  }
  set autocompleteDefaultValue(value: any) {
    this._defaultValue = value;
  }

  @Input("autocomplete-cutom-items")
  public customItems: Function;
  @Input("autocomplete-cutom-filter")
  public customFilter: Function;
  
  @Input()
  get readonly(): boolean { return this._readonly; }
  set readonly(value) { this._readonly = coerceBooleanProperty(value); }

  @Input()
  get required(): boolean { return this._required; }
  set required(value) { this._required = coerceBooleanProperty(value); }

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value) { this._disabled = coerceBooleanProperty(value); }

  @Input()
  get error(): ResponseMessage { return this._error; }
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
  set value(value: any) {
    if (value !== this._value) {
      this._value = value;
      this._inputValue = '';
      if (value != undefined) {
        this.selectedItem = this._autocompleteData.find(value, this._criteria, this.customItems);
        if (this.selectedItem) { 
          this._inputValue = this.selectedItem.text; 
        }
      }
      if (!this._inputValue) { this._inputValue = ''; }
      if (this._isInitialized) {
        this._emitChangeEvent();
      }
    }
  }

  get isMenuVisible(): boolean {
    if (this._btnShowMenu == true) {
      return true;
    }
    else {
      return ((this._inputFocused || this.noBlur) 
            && this._list 
            && this._list.length &&
            !this.selectedItem) && !this.readonly ? true : false;
    }
  }

  /**
   * update scroll of suggestion menu
   */
  private updateScroll() {
    if (this._focusedOption < 0) { return; }
    let menuContainer = this._element.nativeElement.querySelector('.md2-autocomplete-menu');
    if (!menuContainer) { return; }

    let choices = menuContainer.querySelectorAll('.md2-option');
    if (choices.length < 1) { return; }

    let highlighted: any = choices[this._focusedOption];
    if (!highlighted) { return; }

    let top: number = highlighted.offsetTop + highlighted.clientHeight - menuContainer.scrollTop;
    let height: number = menuContainer.offsetHeight;

    if (top > height) {
      menuContainer.scrollTop += top - height;
    } else if (top < highlighted.clientHeight) {
      menuContainer.scrollTop -= highlighted.clientHeight - top;
    }
  }

  /**
   * input event listner
   * @param event
   */
  _handleKeydown(event: KeyboardEvent) {
    if (this.disabled) { return; }
    this.textChange.emit(this._inputValue);
    switch (event.keyCode) {
      case TAB: this._handleMouseLeave(); break;
      case ESCAPE:
        event.stopPropagation();
        event.preventDefault();
        if (this._inputValue) {
          this._onClear();
        }
        break;

      case ENTER:
        event.preventDefault();
        event.stopPropagation();
        if (this.isMenuVisible) {
          this._selectOption(event, this._focusedOption);
        }

        break;

      case DOWN_ARROW:
        event.preventDefault();
        event.stopPropagation();
        if (this.isMenuVisible) {
          this._focusedOption = (this._focusedOption === this._list.length - 1) ? 0 :
            Math.min(this._focusedOption + 1, this._list.length - 1);
          this.updateScroll();
        }
        break;
      case UP_ARROW:
        event.preventDefault();
        event.stopPropagation();
        if (this.isMenuVisible) {
          this._focusedOption = (this._focusedOption === 0) ? this._list.length - 1 :
            Math.max(0, this._focusedOption - 1);
          this.updateScroll();
        }
        break;
      default:
        setTimeout(() => {
          this.updateItems();
          this.updatePosition();
        }, 10);
    }
  }

  /**
   * select option
   * @param event
   * @param index of selected item
   */
  _selectOption(event: Event, index: number) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedItem = this._list[index];
    this._inputValue = this._list[index].text;
    this._error = new ResponseMessage();
    this._btnShowMenu = false;
    this._triggerClick = false;

    this.updateValue();
    this._handleMouseLeave();
  }

  /**
   * clear selected suggestion
   */
  _onClear() {
    if (this.disabled) { return; }
    
    this._inputValue = '';
    this.selectedItem = null;
    this._error = new ResponseMessage();
    this.updateItems();
    this._value = this.selectedItem ? this.selectedItem.value : this.selectedItem;
    this._btnShowMenu = false;
    this._triggerClick = false;

    this.updateValue();
  }

  /**
   * update value
   */
  private updateValue() {
    this._value = this.selectedItem ? this.selectedItem.value : this.selectedItem;
    this._emitChangeEvent();
    this.onFocus();    
  }

  /**
   * component focus listener
   */
  private onFocus() {
    if (this.disabled) { return; }

    let ctrl = this._element.nativeElement.querySelector('input');
    ctrl.focus();    
  }

  /**
   * input focus listener
   */
  _handleFocus() {
    this._inputFocused = true;
    this.updateItems(true);
    this._focusedOption = 0;

    let ctrl = this._element.nativeElement.querySelector('input');
    ctrl.focus();
    setTimeout(function() {
        ctrl.select();
      }, 0);
  }

  /**
   * input blur listener
   */
  _handleBlur() {
      if (this.noBlur == false) {
        let l = this._autocompleteData.filter(this._inputValue, this._criteria, this.customItems, this.customFilter);
        if (l.length > 1) {
          l = this._autocompleteData.filter(this._inputValue, this._criteria, this.customItems, this.customFilter, true);
        }
        
        this._list = l;
        if (this._list.length == 1) {          
          this.selectedItem = this._list[0];
        
          if (this._value != this.selectedItem.value) {
            this._inputValue = this.selectedItem.text;
            this._value = this.selectedItem.value;
            this._error = new ResponseMessage();
            this._emitChangeEvent();
          }
        }
        else {
          if (this._defaultValue != undefined) {              
            this.selectedItem = this._autocompleteData.find(this._defaultValue, this._criteria, this.customItems);
            if (this.selectedItem) { 
              this._value = cloneObject(this._defaultValue);
              this._inputValue = this.selectedItem.text; 
            }
          }
          else {
            this.selectedItem = null;

            if (this._value)
              this._error = new ResponseMessage();
            
            this._inputValue = "";
            this._value = null;
          }
          
          this._emitChangeEvent();
        }

        this._btnShowMenu = false;
        this._triggerClick = false;      
      }

      this._inputFocused = false;
      this._onTouched();
  }

  /**
   * suggestion menu mouse enter listener
   */
  _handleMouseEnter() { this.noBlur = true; }

  /**
   * suggestion menu mouse leave listener
   */
  _handleMouseLeave() { 
    this.noBlur = false;
  }

  /**
   * Update suggestion to filter the query
   * @param query
   */
  private updateItems(equal: boolean = false) {
    if (this._inputValue.length < this.minLength) {
      this._list = [];
    } else {
      this._list = this._autocompleteData.filter(this._inputValue, this._criteria, this.customItems, this.customFilter, equal);
      
      if (this._list.length && this._list[0].text !== this._inputValue) {
        this.selectedItem = null;
      }
      else {
        if (this._isLoading == true) {
          this._btnShowMenu = true;
        }
      }
    }
  }

  _emitChangeEvent(): void {
    let event = new Md2AutocompleteChange();
    event.source = this;
    event.value = this._value;
    
    this._onChange(event.value);    
    this.change.emit(event);
  }

  writeValue(value: any): void {
    if (value !== this._value) {
      this._value = value;
      this._inputValue = '';
      if (value != undefined) {
          this.selectedItem = this._autocompleteData.find(value, this._criteria, this.customItems);
        if (this.selectedItem) { 
          this._inputValue = this.selectedItem.text; 
        }
      }
      if (!this._inputValue) { this._inputValue = ''; }
    }
  }

  registerOnChange(fn: (value: any) => void): void { this._onChange = fn; }

  registerOnTouched(fn: () => {}): void { this._onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _onButtonClick() {
      this._triggerClick = true;
      this.updatePosition();

      let ctrl = this._element.nativeElement.querySelector('input');
      ctrl.focus();
  }

  @HostListener("window:click")
  _onWindowsClick($event) {
    if (this._triggerClick == true) {
      this._list = this._autocompleteData.filter("", this._criteria, this.customItems, this.customFilter);
      
      this._focusedOption = 0;
      if (this.selectedItem != undefined) {
        for(let idx = 0; idx < this._list.length; idx++) {
          if (this.selectedItem.value == this._list[idx].value) {
            this._focusedOption = idx;
            break;
          }
        }
      }
      
      this._btnShowMenu = true;
      this._triggerClick = false;
    }
    else {
        this._btnShowMenu = false;
        this._triggerClick = false;
    }
  }

  public get placeHolder() {
    if (this._autocompletePlaceHolder == "ALL") { 
      return "autocompleteAllPlaceholder";
    }
    else if (this._autocompletePlaceHolder == "EMPTY") {
      return "";
    }

    return "autocompleteSelectPlaceholder";
  }

  public loadDataByCriteria(criteria: AAutoCompleteCriteria): Promise<any> {
    this._criteria = criteria;    
    return this._autocomplete.loadData(this._key, criteria)
      .then(res => {
        this._autocompleteData = res;
        this._isLoading = false;

        if (this._value != undefined) {
          let selectedItem = this._autocompleteData.find(this._value, this._criteria, this.customItems);
          if (selectedItem.value != "") {
              this.selectedItem = selectedItem;
              this._inputValue = this.selectedItem.text;

              if (this._value != this.selectedItem.value) {
                this._value = this.selectedItem.value;
                this._emitChangeEvent();
              }

              if (this.isMenuVisible == true) {                  
                this._list = this._autocompleteData.filter(this._inputValue, this._criteria, this.customItems, this.customFilter);
              }
          }
          else {
            if (this._defaultValue != undefined) {              
              this.selectedItem = this._autocompleteData.find(this._defaultValue, this._criteria, this.customItems);
              if (this.selectedItem) { 
                this._inputValue = this.selectedItem.text;

                this._value = cloneObject(this._defaultValue);
                this._emitChangeEvent();
              }
            }            
            else {
              this.selectedItem = null;
              this._error = new ResponseMessage();
              this._inputValue = "";
              this._value = null;
              this._emitChangeEvent();
            }
          }          
        }
        else if (this._defaultValue != undefined) {              
          this.selectedItem = this._autocompleteData.find(this._defaultValue, this._criteria, this.customItems);
          if (this.selectedItem) { 
            this._inputValue = this.selectedItem.text;

            this._value = cloneObject(this._defaultValue);
            this._emitChangeEvent();
          }
        }
      });
  } 
  public get selectedData(): any
  {
      if (this.selectedItem) {
        return this.selectedItem.data;
      }

      return null;
  }
  private updatePosition() {
    let ctrl = this._element.nativeElement.querySelector('input');
    
    var top = 0, left = 0, c;
    c = ctrl;
    do {
        top += c.offsetTop  || 0;
        left += c.offsetLeft || 0;
        c = c.offsetParent;
    } while(c);

    this.positionTop = top + $(ctrl).outerHeight() - document.body.scrollTop;
    this.positionLeft = left;
    this.width = $(ctrl).outerWidth() + 24;
  }
}
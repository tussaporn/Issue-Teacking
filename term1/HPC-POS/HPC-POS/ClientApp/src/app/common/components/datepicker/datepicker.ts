import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Output,
  Optional,
  EventEmitter,
  Self,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
}                             from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
}                             from '@angular/forms';
import { DateLocale }         from './date-locale';
import { DateUtil }           from './date-util';
import {
  coerceBooleanProperty,
  ENTER,
  SPACE,
  TAB,
  ESCAPE,
  HOME,
  END,
  PAGE_UP,
  PAGE_DOWN,
  LEFT_ARROW,
  RIGHT_ARROW,
  UP_ARROW,
  DOWN_ARROW,
  Overlay,
  OverlayState,
  OverlayRef,
  TemplatePortal,
  HorizontalConnectionPos,
  VerticalConnectionPos,
  textDateLocale
}                               from '../../base';
import { fadeInContent, slideCalendar } from './datepicker-animations';
import { Subscription } from 'rxjs/Subscription';

import { ResponseMessage }  from "../../models";

import moment from "moment";

/** Change event object emitted by Md2Select. */
export class Md2DateChange {
  constructor(public source: Md2Datepicker, public value: Date) { }
}

export type Type = 'date' | 'time' | 'datetime' | 'month' | 'year';
export type Mode = 'auto' | 'portrait' | 'landscape';
export type Container = 'inline' | 'dialog';
export type PanelPositionX = 'before' | 'after';
export type PanelPositionY = 'above' | 'below';

@Component({
  selector: 'md2-datepicker',
  templateUrl: 'datepicker.html',
  styleUrls: ['./datepicker.scss'],
  host: {
    'role': 'datepicker',
    '[class.md2-datepicker-disabled]': 'disabled',
    '[class.md2-datepicker-opened]': 'panelOpen',
    '[attr.aria-label]': 'placeholder',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': '_control?.invalid || "false"',
    '(window:resize)': '_handleWindowResize($event)'
  },
  animations: [
    fadeInContent,
    slideCalendar
  ],
  encapsulation: ViewEncapsulation.None
})
export class Md2Datepicker implements OnDestroy, ControlValueAccessor {

  private _portal: TemplatePortal;
  private _overlayRef: OverlayRef;
  private _backdropSubscription: Subscription;

  private _value: Date = null;
  private _selected: Date = null;
  private _date: Date = null;
  private _monthDate: Date = null;

  private _panelOpen = false;

  private _openOnFocus: boolean = false;
  private _type: Type = 'date';
  private _mode: Mode = 'auto';
  private _container: Container = 'dialog';
  private _format: string;
  private _required: boolean = false;
  private _disabled: boolean = false;
  private _error: ResponseMessage = new ResponseMessage();
  
  private today: Date = new Date();

  private _min: any = null;
  private _max: any = null;

  _years: Array<any> = [];
  _months: Array<any> = [];
  _dates: Array<Object> = [];

  _isMonthsVisible: boolean;
  _isYearsVisible: boolean;
  _isCalendarVisible: boolean;
  _clockView: string = 'hour';
  _calendarState: string;

  _weekDays: Array<any>;

  _prevMonth: number = 1;
  _currMonth: number = 2;
  _nextMonth: number = 3;

  _transformOrigin: string = 'top';
  _panelDoneAnimating: boolean = false;

  _inputFocused: boolean = false;

  _onChange = (value: any) => { };
  _onTouched = () => { };

  @ViewChild('portal') _templatePortal: TemplateRef<any>;

  /** Event emitted when the select has been opened. */
  @Output() onOpen: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitted when the select has been closed. */
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitted when the selected date has been changed by the user. */
  @Output() change: EventEmitter<Md2DateChange> = new EventEmitter<Md2DateChange>();

  constructor(private _element: ElementRef, private overlay: Overlay,
    private _viewContainerRef: ViewContainerRef, private _locale: DateLocale,
    private _util: DateUtil, @Self() @Optional() public _control: NgControl) {
    if (this._control) {
      this._control.valueAccessor = this;
    }

    //this._weekDays = this._locale.getDays();
    this.getWeekDays();
    this.getMonths();
    this.getYears();
  }

  ngOnDestroy() { this.destroyPanel(); }

  @Input() placeholder: string;
  @Input() okLabel: string = 'Ok';
  @Input() cancelLabel: string = 'Cancel';
  @Input() tabindex: number = 0;
  @Input() enableDates: Array<Date> = [];
  @Input() disableDates: Array<Date> = [];
  @Input() disableWeekDays: Array<number> = [];
  
  /** Position of the menu in the X axis. */
  positionX: PanelPositionX = 'after';

  /** Position of the menu in the Y axis. */
  positionY: PanelPositionY = 'below';

  overlapTrigger: boolean = true;

  @Input()
  get type() { return this._type; }
  set type(value: Type) {
    this._type = value || 'date';
  }

  @Input()
  get format() {
    /*
    return this._format || (this.type === 'date' ?
      'dd/MM/y' : this.type === 'time' ? 'HH:mm' : this.type === 'datetime' ?
        'dd/MM/y HH:mm' : 'dd/MM/y');
    */
    return this._format
      || (this.type === "date"? "DD/MM/YYYY"
          : this.type === "time"? "HH:mm"
          : this.type === "datetime"? "DD/MM/YYYY HH:mm"
          : this.type === "month"? "MM/YYYY"
          : this.type === "year"? "YYYY"
          : "DD/MM/YYYY");
  }
  set format(value: string) {
    if (this._format !== value) { this._format = value; }
  }
  
  private _l: string = "en";
  @Input("locale") 
  get locale() {
    return this._l;
  }
  set locale(value: string) {
    this._l = value;

    this.getWeekDays();
    this.getMonths();
    this.getYears();
  }
  
  @Input()
  get mode() { return this._mode; }
  set mode(value: Mode) {
    this._mode = value || 'auto';
  }

  @Input()
  get container() { return this._container; }
  set container(value: Container) {
    if (this._container !== value) {
        this._container = value || 'dialog';
      this.destroyPanel();
    }
  }

  @Input()
  get value() { return this._value; }
  set value(value: Date) {
    this._value = this.coerceDateProperty(value);    
    this.date = this._value;
  }

  get date() { return this._date || this.today; }
  set date(value: Date) {
    if (value && this._util.isValidDate(value)) {
      if (this._min) {
        let min = this._min.value as Date;
        if (min) {
          if (min && min > value) {
            this._min.setValue(value);
          }
        }
      }
      if (this._max) {
        let max = this._max.value as Date;
        if (max) {
          if (max && max < value) {
            this._max.setValue(value);
          }
        }
      }

      this._date = value;
      this._monthDate = value;
    }
    else {
      this._date = null;
      this._monthDate = this.today;
    }
  }

  get time() { return this.date.getHours() + ':' + this.date.getMinutes(); }
  set time(value: string) {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(),
      parseInt(value.split(':')[0]), parseInt(value.split(':')[1]));

    // if (this._clockView === 'hour') {
    //  this.date.setHours(parseInt(value.split(':')[0]));
    // } else {
    //  this.date.setMinutes(parseInt(value.split(':')[1]));
    // }
  }

  @Input()
  get selected() { return this._selected; }
  set selected(value: Date) { this._selected = value; }

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
  set min(value: any) {
    if (value) {
      this._min = value;

      this.getMonths();
      this.getYears();
      
      let min = this._min.value as Date;
      if (min) {
        if (this.value < min) {
          let v = new Date(min);
          if (this.type !== "time" && this.type !== "datetime") {
            v.setHours(0, 0, 0, 0);
          }

          this.value = v;
        }
      }
    }
    else {
      this._min = null;
    }
  }

  @Input()
  set max(value: any) {
    if (value) {
      this._max = value;

      this.getMonths();
      this.getYears();

      let max = this._max.value as Date;
      if (max != undefined) {
        if (this.value > max) {
          let v = new Date(max);
          if (this.type !== "time" && this.type !== "datetime") {
            v.setHours(0, 0, 0, 0);
          }

          this.value = v;
        }
      }
    }
    else {
      this._max = null;
    }
  }

  @Input()
  get openOnFocus(): boolean { return this._openOnFocus; }
  set openOnFocus(value: boolean) { this._openOnFocus = coerceBooleanProperty(value); }

  @Input()
  set isOpen(value: boolean) {
    if (value && !this.panelOpen) {
      this.open();
    }
  }

  @Input()
  timeRange: number = 1;

  get panelOpen(): boolean {
    return this._panelOpen;
  }

  get getDateLabel1(): string {
    return textDateLocale(this.date, "ddd,", this.locale);
  }
  get getDateLabel2(): string {
    return textDateLocale(this.date, "D MMM", this.locale);
  }
  get getDateLabel3(): string {
    return textDateLocale(this.date, "MMM YYYY", this.locale);
  }

  get getMonthLabel(): string {
    return textDateLocale(this._monthDate, "MMMM YYYY", this.locale);
  }

  toggle(): void {
    this.panelOpen ? this.close() : this.open();
  }

  /** Opens the overlay panel. */
  open(): void {
    if (this.disabled) { return; }
    this._isCalendarVisible = this.type !== 'time' ? true : false;

    if (this.type === 'month'
              || this.type === 'year') {
      this._isYearsVisible = true;
      this._isCalendarVisible = true;
      this._scrollToSelectedYear();
    }

    this._createOverlay();

    if (!this._portal) {
      this._portal = new TemplatePortal(this._templatePortal, this._viewContainerRef);
    }

    this._overlayRef.attach(this._portal);
    this._subscribeToBackdrop();
    this._panelOpen = true;
    this.selected = this.value || new Date(1, 0, 1);

    //this.date = this.value || this.today;
    this._monthDate = this.value || this.today;

    this.generateCalendar();
  }

  /** Closes the overlay panel and focuses the host element. */
  close(): void {
    setTimeout(() => {
      this._panelOpen = false;
      if (this._openOnFocus) {
        this._openOnFocus = false;
        setTimeout(() => { this._openOnFocus = true; }, 100);
      }
      // if (!this._date) {
      //  this._placeholderState = '';
      // }
      if (this._overlayRef) {
        this._overlayRef.detach();
        this._backdropSubscription.unsubscribe();
      }
      this._focusHost();

      this._isYearsVisible = false;
      this._isCalendarVisible = this.type !== 'time' ? true : false;
      this._clockView = 'hour';
    }, 10);
  }

  private _clickOnly: boolean = false;

  @Input("click-only")
  public get clickOnly(): boolean {
    return this._clickOnly;
  }
  public set clickOnly(val: boolean) {
    this._clickOnly = val;
  }

  private textToggle() {
    if (this._clickOnly) {
      this.panelOpen ? this.close() : this.open();
    }
  }

  /** Removes the panel from the DOM. */
  destroyPanel(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;

      this._cleanUpSubscriptions();
    }
  }

  _onPanelDone(): void {
    if (this.panelOpen) {
      this._focusPanel();
      this.onOpen.emit();
    } else {
      this.onClose.emit();
    }
  }

  _onFadeInDone(): void {
    this._panelDoneAnimating = this.panelOpen;
  }

  _handleWindowResize(event: Event) {
    if (this.container === 'inline') {
      this.close();
    }
  }

  private _focusPanel(): void {
    let el: any = document.querySelectorAll('.md2-datepicker-panel')[0];
    el.focus();
  }

  private _focusHost(): void {
    this._element.nativeElement.querySelectorAll('input')[0].focus();
  }

  private coerceDateProperty(value: any): Date {
    let v: Date = null;
    if (this._util.isValidDate(value)) {
      v = value;
    } 
    else {
      if (value && this.type === 'time') {
        let t = value + '';
        v = new Date();
        v.setHours(parseInt(t.substring(0, 2)));
        v.setMinutes(parseInt(t.substring(3, 5)));
      } else {
        let timestamp = Date.parse(value);
        v = isNaN(timestamp) ? null : new Date(timestamp);
      }
    }    

    return v;
  }

  @HostListener('click', ['$event'])
  _handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
  }

  _handleKeypress(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      let el: any = event.target;
      let m = moment(el.value, this.format, this.locale);      
      if (m.isValid() == false) {
        if (this.value != undefined) {
          this.value = null;
          this._emitChangeEvent();
        }
      }
      else {
        if (this.locale == "th") {
          m.year(m.year() - 543);
        }
        if (this.type == "time"
            || this.type == "datetime") {
          if (this.timeRange > 0) {
            m.minutes(Math.floor(m.minutes() / this.timeRange) * this.timeRange)
            m.seconds(0);
          }
        }

        this.value = m.toDate();
        this._emitChangeEvent();
      }

      return false;
    }
    else {
      let txt = String.fromCharCode(event.keyCode);
      if (txt != "/" 
          && isNaN(parseInt(txt)) == true) {
        if (txt == ":"
            && (this.type == "time"
                || this.type == "datetime")) {
            //Skip.
        }
        else {
          return false;
        }
      }
    }
  }
  _handleKeydown(event: KeyboardEvent) {
    if (this.disabled) { return; }

    if (this.panelOpen) {
      event.preventDefault();
      event.stopPropagation();

      switch (event.keyCode) {
        case TAB:
        case ESCAPE: this._onBlur(); this.close(); break;
      }
      let date = this.date;
      if (this._isYearsVisible) {
        switch (event.keyCode) {
          case ENTER:
          case SPACE: this._onClickOk(); break;

          case DOWN_ARROW:
            if (this.date.getFullYear() < (this.today.getFullYear() + 100)) {
              this.date = this._util.incrementYears(date, 1);
              this._scrollToSelectedYear();
            }
            break;
          case UP_ARROW:
            if (this.date.getFullYear() > 1900) {
              this.date = this._util.incrementYears(date, -1);
              this._scrollToSelectedYear();
            }
            break;
        }

      } else if (this._isCalendarVisible) {
        switch (event.keyCode) {
          case ENTER:
          case SPACE: this.setDate(this.date); break;

          case RIGHT_ARROW:
            this.date = this._util.incrementDays(date, 1);
            break;
          case LEFT_ARROW:
            this.date = this._util.incrementDays(date, -1);
            break;

          case PAGE_DOWN:
            if (event.shiftKey) {
              this.date = this._util.incrementYears(date, 1);
            } else {
              this.date = this._util.incrementMonths(date, 1);
            }
            break;
          case PAGE_UP:
            if (event.shiftKey) {
              this.date = this._util.incrementYears(date, -1);
            } else {
              this.date = this._util.incrementMonths(date, -1);
            }
            break;

          case DOWN_ARROW:
            this.date = this._util.incrementDays(date, 7);
            break;
          case UP_ARROW:
            this.date = this._util.incrementDays(date, -7);
            break;

          case HOME:
            this.date = this._util.getFirstDateOfMonth(date);
            break;
          case END:
            this.date = this._util.getLastDateOfMonth(date);
            break;
        }
        if (!this._util.isSameMonthAndYear(date, this.date)) {
          this.generateCalendar();
        }
      } else if (this._clockView === 'hour') {
        switch (event.keyCode) {
          case ENTER:
          case SPACE: this.setHour(this.date.getHours()); break;

          case UP_ARROW:
            this.date = this._util.incrementHours(date, 1);
            break;
          case DOWN_ARROW:
            this.date = this._util.incrementHours(date, -1);
            break;
        }
      } else {
        switch (event.keyCode) {
          case ENTER:
          case SPACE:
            this.setMinute(this.date.getMinutes());
            break;

          case UP_ARROW:
            this.date = this._util.incrementMinutes(date, 1);
            break;
          case DOWN_ARROW:
            this.date = this._util.incrementMinutes(date, -1);
            break;
        }
      }
    } else {
      switch (event.keyCode) {
        //case ENTER:
        case SPACE:
          event.preventDefault();
          event.stopPropagation();
          this.open();
          break;
      }
    }
  }

  _onBlur() {
    if (!this.panelOpen) {
      this._onTouched();
    }
  }

  _handleFocus(event: Event) {
    this._inputFocused = true;
    if (!this.panelOpen && this.openOnFocus) {
      this.open();
    }
    else {
      if (this._clickOnly != true) {
        let input = this._element.nativeElement.querySelector('input');
        setTimeout(function() {
          input.select();
        }, 0);
      }
    }
  }

  _handleBlur(event: Event) {
    this._inputFocused = false;
    if (!this.panelOpen) {
      this._onTouched();
    }

    let el: any = event.target;
    let m = moment(el.value, this.format, this.locale);
    if (m.isValid() == false) {
      if (this.value != undefined) {
        this.value = null;
        this._emitChangeEvent();
      }
    }
    else {
      let d: any = m.toDate();
      if (this.type != "time") {
        if (this.locale == "th") {
          m.year(m.year() - 543);
        }
      }
      if (this.timeRange > 0) {
        m.minutes(Math.floor(m.minutes() / this.timeRange) * this.timeRange);
        m.seconds(0);
      }

      this.value = m.toDate();
      this._emitChangeEvent();
    }
  }

  _clearValue(event: Event) {
    event.stopPropagation();
    this.value = null;
    this._emitChangeEvent();
    this._focusHost();
  }

  /**
   * Display Years
   */
  _showYear() {
    this._isYearsVisible = true;
    this._isCalendarVisible = true;
    this._scrollToSelectedYear();
  }

  private getMonths() {
    this._months = [];
    for (let i = 0; i < 12; i++) {      
      this._months.push({
        m: i,
        mtxt: textDateLocale(new Date(this.today.getFullYear(), i, 1), "MMMM", this.locale)
      });
    }
  }
  private getYears() {
    let startYear = 1900;
    let endYear = this.today.getFullYear() + 100;

    if (this._min) {
      let min = this._min.value as Date;
      if (min) {
        startYear = min.getFullYear();
      }  
    }
    if (this._max) {
      let max = this._max.value as Date;
      if (max) {
        endYear = max.getFullYear();
      }  
    }

    this._years = [];
    for (let i = startYear; i <= endYear; i++) {      
      this._years.push({
        y: i,
        ytxt: textDateLocale(new Date(i, 1, 1), "YYYY", this.locale)
      });
    }
  }
  private getWeekDays() {
    this._weekDays = [];
    for(let i = 0; i < 7; i++) {
      let m = moment(new Date(), null, this.locale).weekday(i);
      this._weekDays.push({
        full: m.format("dddd"),
        short: m.format("ddd"),
        xshort: m.format("dd")
      });
    }
  }

  private _scrollToSelectedMonth() {
    setTimeout(() => {
      let monthContainer: any = document.querySelector('.md2-calendar-cmonths'),
          selectedMonth: any = document.querySelector('.md2-calendar-cmonth.selected');
      monthContainer.scrollTop = (selectedMonth.offsetTop + 20) - monthContainer.clientHeight / 2;
    }, 0);
  }
  private _scrollToSelectedYear() {
    setTimeout(() => {
      let yearContainer: any = document.querySelector('.md2-calendar-years'),
        selectedYear: any = document.querySelector('.md2-calendar-year.selected');
      yearContainer.scrollTop = (selectedYear.offsetTop + 20) - yearContainer.clientHeight / 2;
    }, 0);
  }

  _setMonth(month: number) {
    this._monthDate = new Date(this._monthDate.getFullYear(), month, 1, 0, 0);

    this.value = this._monthDate;
    this._emitChangeEvent();
    this._onBlur();
    this.close();
  }

  /**
   * select year
   * @param year
   */
  _setYear(year: number) {
    if (this.type == "year") {
      this._monthDate = new Date(year, 0, 1, 0, 0);

      this.value = this._monthDate;
      this._emitChangeEvent();
      this._onBlur();
      this.close();
    } 
    else if (this.type == "month") {
      this._monthDate = new Date(year, this.date.getMonth(), 1, 0, 0);

      this._isYearsVisible = false;
      this._isMonthsVisible = true;
      this._scrollToSelectedMonth();
    }  
    else {  
      this._monthDate = new Date(year, this.date.getMonth(), this.date.getDate(),
                                  this.date.getHours(), this.date.getMinutes());

      this.generateCalendar();
      this._isYearsVisible = false;
    }
  }

  /**
   * Display Calendar
   */
  _showCalendar() {
    this._isMonthsVisible = false;
    this._isYearsVisible = false;
    this._isCalendarVisible = true;
  }

  /**
   * Toggle Hour visiblity
   */
  _toggleHours(value: string) {
    this._isMonthsVisible = false;
    this._isYearsVisible = false;
    this._isCalendarVisible = false;
    this._isYearsVisible = false;
    this._clockView = value;
  }

  /**
   * Ok Button Event
   */
  _onClickOk() {
    if (this._isYearsVisible) {
      this.generateCalendar();
      this._isYearsVisible = false;
      this._isCalendarVisible = true;
    } else if (this._isCalendarVisible) {
      this.setDate(this.date);
    } else if (this._clockView === 'hour') {
      this._clockView = 'minute';
    } else {
      if (this.timeRange > 0) {
        this.date.setMinutes(Math.floor(this.date.getMinutes() / this.timeRange) * this.timeRange);
        this.date.setSeconds(0);
      }

      this.value = this.date;

      this._emitChangeEvent();
      this._onBlur();
      this.close();
    }
  }

  /**
   * Date Selection Event
   * @param event Event Object
   * @param date Date Object
   */
  _onClickDate(event: Event, date: any) {
    event.preventDefault();
    event.stopPropagation();
    
    if (date.disabled) { return; }

    /*
    if (date.calMonth === this._prevMonth) {
      this._updateMonth(-1);
    } else if (date.calMonth === this._currMonth) {
      this.setDate(date.date);
    } else if (date.calMonth === this._nextMonth) {
      this._updateMonth(1);
    }
    */
    this.setDate(date.date);
  }

  /**
   * Set Date
   * @param date Date Object
   */
  private setDate(date: Date) {
    if (this.type === 'date') {
      this.value = date;
      this._emitChangeEvent();
      this._onBlur();
      this.close();
    } else {
      this.selected = date;
      this.date = date;
      this._isCalendarVisible = false;
      this._clockView = 'hour';
    }
  }

  /**
   * Update Month
   * @param noOfMonths increment number of months
   */
  _updateMonth(noOfMonths: number) {
    //this.date = this._util.incrementMonths(this.date, noOfMonths);
    this._monthDate = this._util.incrementMonths(this._monthDate, noOfMonths);
    this.generateCalendar();
    if (noOfMonths > 0) {
      this.calendarState('right');
    } else {
      this.calendarState('left');
    }
  }

  /**
   * Check is Before month enabled or not
   * @return boolean
   */
  _isBeforeMonth() {    
	// if (this._min != undefined) {
    //   let min = this._min.value as Date;
    //   if (min) {
    //     return this._util.getMonthDistance(this._monthDate, min) < 0;
    //   }
    // }

    return true;
  }

  /**
   * Check is After month enabled or not
   * @return boolean
   */
  _isAfterMonth() {
    // if (this._max) {
    //   let max = this._max.value as Date;
    //   if (max) {
    //     return this._util.getMonthDistance(this._monthDate, max) > 0;
    //   }
    // }

    return true;
  }

  _onTimeChange(event: string) {
    if (this.time !== event) { this.time = event; }
  }

  _onHourChange(event: number) {
    this._clockView = 'minute';
  }

  _onMinuteChange(event: number) {
    this.value = this.date;
    
    this._emitChangeEvent();
    this._onBlur();
    this.close();
  }

  /**
   * Check the date is enabled or not
   * @param date Date Object
   * @return boolean
   */
  private _isDisabledDate(date: Date): boolean {
    for (let d of this.enableDates) {
      if (this._util.isSameDay(date, d)) { return false; }
    }
    for (let d of this.disableDates) {
      if (this._util.isSameDay(date, d)) { return true; }
    }
    for (let d of this.disableWeekDays) {
      if (date.getDay() === d) { return true; }
    }
    //return !this._util.isDateWithinRange(date, this._min, this._max);
    return false;
  }

  /**
   * Generate Month Calendar
   */
  private generateCalendar(): void {
    this._dates.length = 0;

    let year = this._monthDate.getFullYear();
    let month = this._monthDate.getMonth();
    let firstDayOfMonth = this._util.getFirstDateOfMonth(this._monthDate);
    let calMonth = this._prevMonth;
    let date = this._util.getFirstDateOfWeek(firstDayOfMonth, this._locale.firstDayOfWeek);


    for(let w = 0; w < 6; w++) {
      let week: Array<any> = [];
      for (let i = 0; i < 7; i++) {
        if (date.getDate() === 1) {
          if (calMonth === this._prevMonth) {
            calMonth = this._currMonth;
          } else {
            calMonth = this._nextMonth;
          }
        }
        week.push({
          date: date,
          index: date.getDate(),
          calMonth: calMonth,
          today: this._util.isSameDay(this.today, date),
          disabled: this._isDisabledDate(date)
        });
        date = new Date(date.getTime());
        date.setDate(date.getDate() + 1);
      }

      this._dates.push(week);
    }

    /*
    do {
      let week: Array<any> = [];
      for (let i = 0; i < 7; i++) {
        if (date.getDate() === 1) {
          if (calMonth === this._prevMonth) {
            calMonth = this._currMonth;
          } else {
            calMonth = this._nextMonth;
          }
        }
        week.push({
          date: date,
          index: date.getDate(),
          calMonth: calMonth,
          today: this._util.isSameDay(this.today, date),
          disabled: this._isDisabledDate(date)
        });
        date = new Date(date.getTime());
        date.setDate(date.getDate() + 1);
      }
      this._dates.push(week);

    } while ((date.getMonth() <= month) && (date.getFullYear() === year));
    */
  }

  /**
   * Set hours
   * @param hour number of hours
   */
  private setHour(hour: number) {
    this._clockView = 'minute';
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(),
      this.date.getDate(), hour, this.date.getMinutes());
  }

  /**
   * Set minutes
   * @param minute number of minutes
   */
  private setMinute(minute: number) {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(),
      this.date.getDate(), this.date.getHours(), minute);

    this.selected = this.date;
    this.value = this.date;
    this._emitChangeEvent();
    this._onBlur();
    this.close();
  }

  /** Emits an event when the user selects a date. */
  _emitChangeEvent(): void {
    this._error = new ResponseMessage();
    this._onChange(this.value);
    this.change.emit(new Md2DateChange(this, this.value));
  }

  writeValue(value: any): void {
    if (value != undefined) {
      if (!(value instanceof Date)) {
        if (this.type == "time") {
          let vc = moment(value, this.format);
          if (vc.isValid()) {
            value = vc.toDate();
          }
        }
        else {
          let vc = moment(value);
          if (vc.isValid()) {
            value = vc.toDate();
          }
        }
      }

      if (this.type == "time"
        || this.type == "datetime") {
          if (this.timeRange > 1) {
              let cm = value.getMinutes();
              let ncm = Math.floor(value.getMinutes() / this.timeRange) * this.timeRange;
              if (cm != ncm) {
                value.setMinutes(ncm);
                value.setSeconds(0);

                this.value = value;
                this._emitChangeEvent();
              }
          }
      }
    }

    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void { this._onChange = fn; }

  registerOnTouched(fn: () => {}): void { this._onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private _subscribeToBackdrop(): void {
    this._backdropSubscription = this._overlayRef.backdropClick().subscribe(() => {
      this.close();
    });
  }

  /**
   *  This method creates the overlay from the provided panel's template and saves its
   *  OverlayRef so that it can be attached to the DOM when open is called.
   */
  private _createOverlay(): void {
    if (!this._overlayRef) {
      let config = new OverlayState();
      if (this.container === 'inline') {
        const [posX, fallbackX]: HorizontalConnectionPos[] =
          this.positionX === 'before' ? ['end', 'start'] : ['start', 'end'];

        const [overlayY, fallbackOverlayY]: VerticalConnectionPos[] =
          this.positionY === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];

        let originY = overlayY;
        let fallbackOriginY = fallbackOverlayY;

        if (!this.overlapTrigger) {
          originY = overlayY === 'top' ? 'bottom' : 'top';
          fallbackOriginY = fallbackOverlayY === 'top' ? 'bottom' : 'top';
        }
        config.positionStrategy = this.overlay.position().connectedTo(this._element,
          { originX: posX, originY: originY },
          { overlayX: posX, overlayY: overlayY })
          .withFallbackPosition(
          { originX: fallbackX, originY: originY },
          { overlayX: fallbackX, overlayY: overlayY })
          .withFallbackPosition(
          { originX: posX, originY: fallbackOriginY },
          { overlayX: posX, overlayY: fallbackOverlayY })
          .withFallbackPosition(
          { originX: fallbackX, originY: fallbackOriginY },
          { overlayX: fallbackX, overlayY: fallbackOverlayY });
        config.hasBackdrop = true;
        config.backdropClass = 'cdk-overlay-transparent-backdrop';
      } else {
        config.positionStrategy = this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically();
        config.hasBackdrop = true;
      }
      this._overlayRef = this.overlay.create(config);
    }
  }

  private _cleanUpSubscriptions(): void {
    if (this._backdropSubscription) {
      this._backdropSubscription.unsubscribe();
    }
  }

  private calendarState(direction: string): void {
    this._calendarState = direction;
    setTimeout(() => this._calendarState = '', 180);
  }

}

import { 
    FormBuilder 
}                                       from "@angular/forms";

import {
    PAGE_STEP, 
    DISPLAY_PAGE 
}                               from "../common.constant";
import {
    textNumeric,
    textFormat,
    cloneObject    
}                               from "../base";
import { 
    CtmTableService, 
    CtmTranslateService
}                               from "../services";
import {
    CtmControlResource,
    CtmControlManagement
}                               from "../models";

import { ResponseMessage }      from "./message.data";

export class CtmTableControlManagement {
    public controls: Array<CtmControlManagement> = [];

    constructor(
        private fb: FormBuilder,
        private mapping: any,
        private resource: CtmControlResource = null
    ) {
    }

    public addControl(data) {
        let ctrlMgr = new CtmControlManagement(
            this.fb.group(this.mapping),
            this.resource
        );
        ctrlMgr.data = data;
        ctrlMgr.change.subscribe(()=> {
            for (let ctrl in ctrlMgr["form"].controls) {
                data[ctrl] = ctrlMgr["form"].controls[ctrl].value;
            }
        });
        ctrlMgr.resetChanged();

        if (this.controls != undefined) {
            this.controls.push(ctrlMgr);
        } 
    }
    public moveControl(type, idx) {
        if (this.controls.length > 0) {
            let controls = [];
            for(let rIdx = 0; rIdx < this.controls.length; rIdx++) {
                if (type == "u") {
                    if (idx - 1 == rIdx) {
                        controls.push(this.controls[idx]);
                    }
                    else if (idx == rIdx) {
                        continue;
                    }
                }
                else if (type =="d") {
                    if (idx == rIdx) {
                        controls.push(this.controls[rIdx + 1]);
                    }   
                    else if (idx + 1 == rIdx) {
                        continue;
                    }  
                }
                controls.push(this.controls[rIdx]);
            }

            this.controls = controls;
        }
    }
    public deleteControl(idx) {
        let ncontrols = [];
        for(let rIdx = 0; rIdx < this.controls.length; rIdx++) {
            if (rIdx != idx) {
                ncontrols.push(this.controls[rIdx]);
            }
        }

        this.controls = ncontrols;
    }
    public getFormControl(idx) {
        if (idx >= 0 && idx < this.controls.length) {
            return this.controls[idx]["form"];
        }

        return null;
    }
    public updateValue(idx, name, value) {
        let form = this.getFormControl(idx);
        form.controls[name].setValue(value);
    }

    public error(idx, name) { 
        if (idx >= 0 && idx < this.controls.length) {
            let ctrlMgr = this.controls[idx];
            return ctrlMgr.error(name);
        }

        return null;
    }
    public hasError(idx) {
        if (idx >= 0 && idx < this.controls.length) {
            let ctrlMgr = this.controls[idx];
            for (let field in ctrlMgr.formErrors) {
                if (ctrlMgr.formErrors[field] != undefined) {
                    if (ctrlMgr.formErrors[field].message != undefined) {
                        return true;
                    }
                }                    
            }
        }

        return false;
    }

    public validate(): boolean {
        let error = false;
        for(let idx = 0; idx < this.controls.length; idx++) {
            let ctrlMgr = this.controls[idx];
            if (ctrlMgr.validate() == false) {
                error = true;
            }
        }

        return !error;
    }

    public clear() {
        this.controls = [];
    }
}

export class CtmTableData {
    public totalColumns: number = 1;
    public totalRecords: number = 0;
    public pageNumber: number;
    public loading: boolean;
    public displayPage: number;
    public rows: Array<Object>;
    public pagging: any;
    public loaded: boolean;
    public url: string;
    public loadAllData: boolean;
    public controlManager: CtmTableControlManagement;
    public isTableEdit: boolean = false;
    public criteria: any;
    public deleteRows: Array<Object>;
    public showLoading: boolean = true;
    
    constructor(
        private service:CtmTableService,

        columns: number = 1,
        url: string = null
    ) {
        this.totalColumns = columns;
        this.url = url;

        this.pageNumber = 1;
        this.displayPage = DISPLAY_PAGE;
        this.loading = false;
        this.loaded = false;
        this.rows = [];
        this.totalRecords = 0;

        this.updatePaggingInfo();        
    }

    public updatePaggingInfo() {
      let totalPages = Math.ceil(this.totalRecords / this.displayPage);
      if (this.pageNumber > totalPages
      && totalPages > 0) {
        this.pageNumber = totalPages;
      }

      let range = Math.ceil(this.pageNumber / PAGE_STEP);
      let maxRange = Math.ceil(totalPages / PAGE_STEP);

      let ranges = [];
      let start = ((range - 1) * PAGE_STEP) + 1;
      if (this.totalRecords > 0
            && start > 0) {
        for(let idx = start; idx < start + PAGE_STEP; idx++) {
          ranges.push({
            number: idx,
            numberText: textNumeric(idx, { comma: true }),
            current: (idx == this.pageNumber)
          });

          if (idx >= totalPages) {
            break;
          }
        }
      }
    
      let from = ((this.pageNumber - 1) * this.displayPage) + 1;
      let to = ((this.pageNumber - 1) * this.displayPage) + (this.loadAllData ? this.totalRecords : this.displayPage);
      if (to > this.totalRecords) {
        to = this.totalRecords;
      }

      let showf = (range > 1 && range <= maxRange);
      let f = 1;
      let ff = ((range - 2) * PAGE_STEP) + 1;

      let showl = (range < maxRange);
      let n = totalPages;
      let nn = (range * PAGE_STEP) + 1;

      this.pagging = {
        from: from,
        to: to,
        first: {
          show: showf,
          f: { number: f, numberText: textNumeric(f, { comma: true }) },
          ff: { number: ff, numberText: textNumeric(ff, { comma: true }) }
        },
        last: {
          show: showl,
          n: { number: n, numberText: textNumeric(n, { comma: true }) },
          nn: { number: nn, numberText: textNumeric(nn, { comma: true }) }
        },
        ranges: ranges
      };
    }

    public refresh(): Promise<Object> {
        return this.service.loadData(this);
    }
    public loadData(criteria): Promise<Object> {
        if (criteria != undefined) {
            this.criteria = {};
            this.criteria = cloneObject(criteria);

            if (this.criteria.page > 0) {
                this.pageNumber = this.criteria.page;
            }
            else {
                this.pageNumber = 1;
            }
            
            if (this.criteria.paging > 0) {
                this.displayPage = this.criteria.paging;
            }
        }

        if (this.criteria == undefined) {
            this.criteria = {};
        }
        this.criteria.page = this.pageNumber;
        this.criteria.paging = this.displayPage;

        this.deleteRows = null;
        return this.service.loadData(this);
    }
    public loadLocalData(rows) {
        if (rows != undefined) {
            this.rows = rows;
            this.totalRecords = rows.length;
        }
        else {
            this.rows = [];
            this.totalRecords = 0;
        }

        this.deleteRows = null;
    }

    public insertRow(row, option = null) {
        if (row != undefined) {
            let edit = true;
            if (option != undefined) {
                if (option.edit != undefined) {
                    edit = option.edit;
                }
            }
            if (edit == true) {
                for(let idx = 0; idx < this.rows.length; idx++) {
                    this.rows[idx]["isEditRow"] = false;
                }
            }
        
            let ndata = cloneObject(row);
            ndata.isNewRow = true;
            ndata.isEditRow = edit;
            ndata.rowNumber = (this.rows.length + 1);

            if (this.controlManager != undefined) {
                this.controlManager.addControl(ndata);
            }

            this.rows.push(ndata);
            this.totalRecords += 1;

            jQuery("html, body").animate({ scrollTop: $(document).height() }, { duration: 1000 });
        }
    }
    public deleteRow(idx) {
        if (idx >= 0 && idx < this.rows.length) {
            let row = this.rows[idx];
            
            if (this.deleteRows == undefined) {
                this.deleteRows = [];
            }
            if (!row["isNewRow"]) {
                this.deleteRows.push(row);
            }

            let rowNumber = 1;
            let nrows = [];
            for(let rIdx = 0; rIdx < this.rows.length; rIdx++) {
                if (rIdx != idx) {
                    let nrow = this.rows[rIdx];
                    nrow["rowNumber"] = rowNumber;
                    nrows.push(nrow);

                    rowNumber++;
                } 
            }

            this.rows = nrows;
            this.totalRecords = this.rows.length;

            if (this.controlManager != undefined) {
                this.controlManager.deleteControl(idx);
            }
        }        
    }

    public set tableEdit(edit) {
        this.isTableEdit = edit;
        
        if (this.rows.length > 0) {
            this.rows[0]["isEditRow"] = edit;
        }     
    }
    public get tableEdit(): boolean {
        return this.isTableEdit;
    }

    public isEditRow(row) {
        if (row.isEditRow != undefined) {
            return row.isEditRow && this.isTableEdit;
        }

        return false;
    }
    public editRow(row, edit) {
        if (this.isTableEdit) {
            if (edit == true) {
                for(let idx = 0; idx < this.rows.length; idx++) {
                    this.rows[idx]["isEditRow"] = false;
                }
            }

            row.isEditRow = edit;
        }
    }

    public moveRowPosition(type, idx) {
        if (this.rows.length > 0) {
            let rows = [];
            for(let rIdx = 0; rIdx < this.rows.length; rIdx++) {
                if (type == "u") {
                    if (idx - 1 == rIdx) {
                        rows.push(this.rows[idx]);
                    }
                    else if (idx == rIdx) {
                        continue;
                    }
                }
                else if (type =="d") {
                    if (idx == rIdx) {
                        rows.push(this.rows[rIdx + 1]);
                    }   
                    else if (idx + 1 == rIdx) {
                        continue;
                    }  
                }
                rows.push(this.rows[rIdx]);
            }

            this.rows = rows;
        }    
        if (this.controlManager != undefined) {
            this.controlManager.moveControl(type, idx);
        }
        
        return false;    
    }

    public rowFormControl(idx) {
        if (this.controlManager != undefined) {
            return this.controlManager.getFormControl(idx);
        }

        return null;
    }
    public validateTableData(): boolean {
        if (this.controlManager != undefined) {
            return this.controlManager.validate();
        }
        
        return true;
    }
    public rowError(idx, name) {
        if (this.controlManager != undefined) {
            return this.controlManager.error(idx, name);
        }

        return null;
    }
    private rowErrorClass(idx) {
        if (this.controlManager != undefined) {
            if (this.controlManager.hasError(idx)) {
                return "error";
            }
        }

        return "";
    }

    public clearData() {
      this.rows = [];
      this.pageNumber = 1;
      this.displayPage = DISPLAY_PAGE;
      this.totalRecords = 0;
      this.loading = false;
      this.loaded = false;
      this.updatePaggingInfo();

        if (this.controlManager != undefined) {
            this.controlManager.clear();
        }
    }
}
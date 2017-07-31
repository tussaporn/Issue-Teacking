import { Injectable }       from "@angular/core";

import { 
    ApiService
}                           from "../ctmApiCaller";
import {
    CtmApiSpinner
}                           from "../ctmApiSpinner";
import { 
    CtmTableData,
    ResponseMessage 
}                           from "../../models";

@Injectable()
export class CtmTableService {
    constructor(
        private api: ApiService,
        private spinner: CtmApiSpinner
    ) {
    }

    public loadData(table: CtmTableData): Promise<Object> {
        var complete: Function;
        var promise = new Promise((resolve, reject) => {
            complete = resolve;
        });

        if (table.controlManager != undefined) {
            table.controlManager.clear();
        }
        
        table.loading = true;
        if (table.loadAllData == true) {
            table.criteria.page = 1;
            table.criteria.paging = 500;
            
            let continueLoad = function (
                    api: ApiService, 
                    spinner: CtmApiSpinner,
                    rowCount: number) {
                if (rowCount == 0) {
                    if (table.showLoading == true) {
                        spinner.show();
                    }
                }

                api.callApiController(table.url, {
                    type: "POST",
                    showLoading: false,
                    data: table.criteria
                }).then(
                    data => {
                        if (data != undefined) {
							if (rowCount == 0) {
								let rowNumber = 1;
								for (let idx = 0; idx < data["Rows"].length; idx++) {
                                    let row = data["Rows"][idx];
									row["rowNumber"] = rowNumber + idx;

                                    if (table.controlManager != undefined) {
                                        table.controlManager.addControl(row);
                                    }
								}

                                table.totalRecords = data["TotalRecords"];
                                table.rows = data["Rows"];

                                rowCount = table.rows.length;
                                if (rowCount >= table.totalRecords) {
                                    table.updatePaggingInfo();
                                    table.loading = false;
                                    table.loaded = true;

                                    if (table.showLoading == true) {
                                        spinner.hide(500);
                                    }
                                    complete();
                                }
                                else {
                                    table.criteria.page += 1;
                                    continueLoad(api, spinner, rowCount);
                                }
                            }
							else {
								let rowNumber = 1;
								if (table.rows != undefined) {
									rowNumber = table.rows.length + 1;
								}
								for (let idx = 0; idx < data["Rows"].length; idx++) {
                                    let row = data["Rows"][idx];
									row["rowNumber"] = rowNumber + idx;

                                    if (table.controlManager != undefined) {
                                        table.controlManager.addControl(row);
                                    }
								}

                                table.rows = table.rows.concat(data["Rows"]);

                                rowCount = table.rows.length;
                                if (rowCount >= table.totalRecords) {
                                    table.updatePaggingInfo();
                                    table.loading = false;
                                    table.loaded = true;
                                    
                                    if (table.showLoading == true) {
                                        spinner.hide(500);
                                    }
                                    complete();
                                }
                                else {
                                    table.criteria.page += 1;
                                    continueLoad(api, spinner, rowCount);
                                }
                            }
                        }
                        else {
                            table.totalRecords = 0;
                            table.rows = [];
                            table.updatePaggingInfo();
                            table.loading = false;
                            table.loaded = true;
                            
                            if (table.showLoading == true) {
                                spinner.hide(500);
                            }
                            complete();
                        }
                    }
                );
            }

            continueLoad(this.api, this.spinner, 0);
        }
        else {
            this.api.callApiController(table.url, {
                  type: "POST",
                  showLoading: table.showLoading,
                  data: table.criteria
              }).then(
                  data => {
                      if (data != undefined) {
                          table.totalRecords = data["TotalRecords"];
                          table.rows = data["Rows"];

                          if (table.rows != undefined) {
                              let start = ((table.pageNumber - 1) * table.displayPage) + 1;

                              for (let idx = 0; idx < table.rows.length; idx++) {
                                let row = table.rows[idx];
                                row["rowNumber"] = start + idx;

                                if (table.controlManager != undefined) {
                                    table.controlManager.addControl(row);
                                }
                              }
                          }
                      }
                      else {
                          table.totalRecords = 0;
                          table.rows = [];
                      }

                      table.updatePaggingInfo();
                      table.loading = false;
                      table.loaded = true;
                      
                      complete();
                  }
              );
        }
        
        return promise;
    }
}
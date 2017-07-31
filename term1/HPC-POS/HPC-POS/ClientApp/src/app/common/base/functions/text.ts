import moment from "moment";

export function textFormat (format, parameters) {
    var txt = format;
    if (format != undefined
        && parameters != null) {
        return txt.replace(/{(\d+)}/g, function (match, number) {
            return typeof parameters[number] != 'undefined'
                      ? (parameters[number] != null ? parameters[number] : "") : match;
                });
    }

    return txt;
}
export function textNumeric(value, option = null): string {
    var result = value;
    if (typeof (result) == "string") {
        result = parseFloat(value.replace(/^(-?)0+([0-9])/, "$1$2").replace(/ /g, "").replace(/,/g, ""));
    }
    
    if (result != undefined && isNaN(result) == false) {
        if (option != undefined) {
            if (result == 0
                && option.hideZero == true) {
                result = "";
            }
            else {
                if (option.precision != undefined) {
                    var max = Math.pow(10, (option.precision - (option.scale != undefined ? option.scale : 0))) - 1;
                    if (option.scale != undefined) {
                        if (option.scale > 0) {
                            max += (1 - (1 / Math.pow(10, option.scale)));
                        }
                    }
                    if (result > max) {
                        result = max;
                    }

                    if (option.maxValue != undefined) {
                        if (result > option.maxValue) {
                            result = option.maxValue;
                        }
                    }
                    if (option.minValue != undefined) {
                        if (result < option.minValue) {
                            result = option.minValue;
                        }
                    }
                }
                if (option.scale != undefined) {
                    if (option.scale >= 0) {
                        result = new Number(result + '').toFixed(option.scale);
                    }
                }

                if (option.comma == true) {
                    result = setComma(result);
                }
                if (option.format != undefined) {
                    result = textFormat(option.format, [result]);
                }
            }
        }
        
        return result + "";
    }

    return "";
}

function setComma(txt) {
    if (txt != undefined) {
        var sout = "";
        if (typeof (txt) != "string")
            txt = txt.toString();

        var result = txt.replace(/^(-?)0+([0-9])/, "$1$2").replace(/ /g, "").replace(/,/g, "");
        var spt = result.split(".");
        if (spt.length > 0) {
            var pos = 1;
            var num = "0";
            if (spt[0] != "") {
                num = parseInt(spt[0]).toString();

                if (num == "0" && spt[0].charAt(0) == "-")
                    num = "-" + num;
            }

            for (var idx = num.length - 1; idx >= 0; idx--) {
                if (num.charAt(idx) != "-") {
                    if (pos % 4 == 0) {
                        sout = "," + sout;
                        pos = 1;
                    }
                }

                sout = num.charAt(idx) + sout;
                pos++;
            }

            if (spt.length > 1) {
                if (spt[1] != "") {
                    if (sout == "")
                        sout = "0";
                    else if (sout == "-")
                        sout = "-0";
                    sout = sout + "." + spt[1];
                }
            }
        }

        return sout;
    }

    return "";
}

export function textDateLocale(value, format, locale): string {
    let txt = "";
    if (value != undefined) {
        if (locale == "th") {
            let f = format.replace("YYYY", "[[TH]]");
            let fy = "YYYY";
            
            txt = moment(value, null, "th").format(f);
            
            let txty = (parseInt(moment(value).format(fy)) + 543).toString();
            txt = txt.replace("[TH]", txty);
        }
        else {
            txt = moment(value).format(format);
        }
    }

    return txt;
}
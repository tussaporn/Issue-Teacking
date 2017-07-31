export function convertBoolean(txt): boolean {
    if (txt == undefined) {
        return false;
    }
    
    if (typeof(txt) == "string") {
        return (txt.toUpperCase() == "TRUE"
                        || txt == "1"
                        || txt == "Y"); 
    }
    else if (typeof (txt) == "number") {
                return txt == 1;
            }

            return txt == true;
}
export function convertNumber(txt): number {
    if (typeof(txt) == "string") {
        if (txt == undefined
            || txt == "") {
            return null;
        }

        return parseFloat(txt);
    }
    
    return txt;
}
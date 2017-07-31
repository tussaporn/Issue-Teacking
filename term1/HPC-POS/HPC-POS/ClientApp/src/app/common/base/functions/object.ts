import moment from "moment";

Date.prototype.toJSON = function () {
    return moment(this).format();
}

export function cloneObject(object) {
    if (object == undefined) {
        return { };
    }

    return JSON.parse(JSON.stringify(object));;
}
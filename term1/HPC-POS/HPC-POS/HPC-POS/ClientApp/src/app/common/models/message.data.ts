export class ResponseMessage {
    public type: string;
    public message: string;

    public get messageClass() {
        if (this.type == "error") {
            return "has-danger";
        }

        return "";
    }
    public get controlClass() {
        if (this.type == "error") {
            return "form-control-danger";
        }

        return "";
    }
    public get tooltipClass() {
        if (this.type == "error") {
            return "tooltip-danger";
        }

        return "";
    }
}
export class Alert {
    type: AlertType;
    displayId: string;
    message: string;
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}
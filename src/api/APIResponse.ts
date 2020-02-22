export enum EAPIResponseStatus {
    success = 'success',
    error = 'error',
    forbidden = 'forbidden',
    unauthorized = 'unauthorized',
}

export interface IAPIResponse {
    status: EAPIResponseStatus;
    timestamp: string;
    message: string;
    data: any;
}

export class APIResponse implements IAPIResponse {

    private _status: EAPIResponseStatus;
    private _timestamp: string;
    private _data: any = {};
    private _message: string;


    public constructor(status: EAPIResponseStatus, message: string) {
        this._status = status;
        this._message = message;
        this._timestamp = (new Date()).toISOString();
    }

    public get status(): EAPIResponseStatus {
        return this._status;
    }

    public get timestamp(): string {
        return this._timestamp;
    }

    public get message(): string {
        return this._message;
    }

    public get data(): any {
        return this._data;
    }

    public setData(value: any): APIResponse {
        this._data = value;
        return this;
    }

    public static createResponse(status: EAPIResponseStatus, message: string): APIResponse {
        return new APIResponse(status, message);
    }
}
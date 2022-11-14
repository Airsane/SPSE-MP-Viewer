import {get} from "./Utils";

export default class WebSite {
    private readonly _url: string;
    private _status: boolean | null = null;

    constructor(url: string) {
        this._url = url;
    }


    get url(): string {
        return this._url;
    }


    get status(): boolean | null {
        return this._status;
    }

    public async isOnline(): Promise<Boolean> {
        if (this._status !== null) {
            return this._status;
        }
        try {
            await get(this._url);
            this._status = true;
            return true;
        } catch (error) {
            this._status = false;
            return false;
        }
    }
}
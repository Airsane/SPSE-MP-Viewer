import {get} from "./Utils";
import * as cheerio from 'cheerio';

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
            const {data} = (await get(this._url));
            const $ = cheerio.load(data);
            const title = $('body > h1');
            if(title){
                this._status = !(title.text() === this._url.split('//')[1]);
            }else{
                this._status = true;
            }
            return true;
        } catch (error) {
            this._status = false;
            return false;
        }
    }
}
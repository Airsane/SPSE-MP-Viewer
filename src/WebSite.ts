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

    private extractDomainFromUrl(): string {
        return this._url.split('//')[1];
    }

    private async checkWebsiteContent(): Promise<boolean> {
        const {data} = await get(this._url);
        const $ = cheerio.load(data);
        const title = $('body > h1');

        if (!title.length) {
            return true;
        }

        const titleText = title.text();
        return titleText !== this.extractDomainFromUrl();
    }

    public async isOnline(): Promise<boolean> {
        if (this._status !== null) {
            return this._status;
        }

        try {
            this._status = await this.checkWebsiteContent();
            return this._status;
        } catch (error) {
            this._status = false;
            return false;
        }
    }
}
import * as cheerio from "cheerio";
import {get} from "./Utils";
export default class SPSEURLGrabber{
    public static async grabURLs(): Promise<string[]> {
        const {data} = await get('https://mp.spse-net.cz');
        const $ = cheerio.load(data);
        const urls = $('table tr td:first-child').map((i, el) => {
            return $(el).text();
        }).get();
        return [...new Set(urls)];
    }
}
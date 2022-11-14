import axios from "axios";
import * as https from "https";

export const get = async (url: string) => {
    const agent = new https.Agent({
        rejectUnauthorized: false
    });
    return axios.get(url, {httpsAgent: agent});
}

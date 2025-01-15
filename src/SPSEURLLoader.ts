import axios from "axios";
import * as fs from "fs";
import https from "https";

const getUrls = async (): Promise<{url: string, classxD:string}[]> => {
    // axios ignore certificate errors
    axios.defaults.httpsAgent = new https.Agent({rejectUnauthorized: false});
    const data: { firstName: string, lastName: string, shortcut: string, class: string }[] = (await axios.get("https://jsonkeeper.com/b/W3WK")).data;
    const urls: {url: string, classxD:string}[] = [];
    data.forEach((student)=>{
        // convert lastname to lowercase remove spaces and replace non utf-8 characters with utf for example "á" -> "a" and max 6 characters
        const lastname = student.lastName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').slice(0, 6);
        const url = `${lastname}${student.shortcut}.mp.spse-net.cz`;
        // add http and https to the url
        const http = `http://${url}`;
        const https = `https://${url}`;
        urls.push({url:http, classxD:student.class});
        urls.push({url:https, classxD:student.class});
    });
    return urls;
}

export default getUrls;
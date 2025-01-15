import * as fs from "fs";

const getUrls = (): {url: string, classxD:string}[] => {
    const data: { firstName: string, lastName: string, shortcut: string, class: string }[] = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
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
import * as fs from "fs";

const getUrls = (): string[] => {
    // load file data.json it returns array of strings with urls
    return JSON.parse(fs.readFileSync('./data.json', 'utf8'));

}

export default getUrls;
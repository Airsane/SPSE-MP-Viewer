import WebSite from "./WebSite";
import express, { Express, Request, Response } from 'express';
import SPSEURLLoader from "./SPSEURLLoader";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const websites: { https: WebSite, classxD: string }[] = [];


const loadWebsites = async () => {
    const urls = await SPSEURLLoader();
    for (const url of urls) {
        websites.push({ https: new WebSite(url.url), classxD: url.classxD });
    }
    console.log("Website loaded successfully from file data.json " + websites.length);
}


const app: Express = express();
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');
app.get('/', (req: Request, res: Response) => {
    res.render('pages/index', { websites, url: process.env.API_URL });
});

app.get('/api/websites', async (req: Request, res: Response) => {
    const url = process.env.WEBSITES_URL || "";
    const data:{ https: WebSite, classxD: string }[] = (await axios.get(url)).data;

    //sort by online status
    data.sort((a, b) => {
        return a.https.status === b.https.status ? 0 : a.https.status ? -1 : 1;
    });

    res.json(data);

})

app.get('/api/load', async (req: Request, res: Response) => {
    if (websites.length === 0) {
        await loadWebsites();
    }
    for (const { https } of websites) {
        await https.isOnline();
    }
    res.json(websites);
})


app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');

});
import WebSite from "./WebSite";
import express, { Express, Request, Response } from 'express';
import SPSEURLLoader from "./SPSEURLLoader";

const websites: { https: WebSite, classxD: string }[] = [];


const loadWebsites = async () => {
    const urls = await SPSEURLLoader();
    for (const url of urls) {
        websites.push({ https: new WebSite(url.url), classxD: url.classxD });
    }
    console.log("Websites loaded successfully from file data.json " + websites.length);
}


const app: Express = express();
app.set('view engine', 'ejs');
app.get('/', (req: Request, res: Response) => {
    res.render('pages/index', { websites });
});

app.get('/api/websites', async (req: Request, res: Response) => {
    if (websites.length === 0) {
        await loadWebsites();
    }
    for (const { https } of websites) {
        await https.isOnline();
    }

    //sort by online status
    websites.sort((a, b) => {
        return a.https.status === b.https.status ? 0 : a.https.status ? -1 : 1;
    });

    res.json(websites);

})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');

});
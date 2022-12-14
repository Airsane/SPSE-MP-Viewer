import WebSite from "./WebSite";
import express, {Express, Request, Response} from 'express';
import SPSEURLLoader from "./SPSEURLLoader";

const websites: { https: WebSite }[] = [];


const loadWebsites = () => {
    const urls = SPSEURLLoader();
    for (const url of urls) {
        websites.push({https: new WebSite(url)});
    }
    console.log("Websites loaded successfully from file data.json " + websites.length);
}


const app: Express = express();
app.set('view engine', 'ejs');
app.get('/', (req: Request, res: Response) => {
    res.render('pages/index', {websites});
});

app.get('/api/websites', async (req: Request, res: Response) => {
    if (websites.length === 0) {
        loadWebsites();
    }
    for (const {https} of websites) {
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
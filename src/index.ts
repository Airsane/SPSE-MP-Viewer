import URLFormatter from "./URLFormatter";
import SPSEURLGrabber from "./SPSEURLGrabber";
import WebSite from "./WebSite";
import express, {Express, Request, Response} from 'express';
const websites: {http: WebSite, https: WebSite}[] = [];
(async () => {
    const urls = await SPSEURLGrabber.grabURLs();

    for (const url of urls) {
        websites.push({http: new WebSite(URLFormatter.format(url).http), https: new WebSite(URLFormatter.format(url).https)});
    }
    for (const {http,https} of websites) {
        await http.isOnline();
        await https.isOnline();
    }

})();



const app: Express = express();
app.set('view engine', 'ejs');
app.get('/', (req: Request, res: Response) => {
    res.render('pages/index', {websites});
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');

});
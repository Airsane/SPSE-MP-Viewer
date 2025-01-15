import WebSite from "./WebSite";
import express, { Express, Request, Response } from 'express';
import SPSEURLLoader from "./SPSEURLLoader";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

// Types
interface Website {
    https: WebSite;
    classxD: string;
}

// Constants
const PORT = process.env.PORT || 3000;
const WEBSITES_URL = process.env.WEBSITES_URL || "";
const API_URL = process.env.API_URL;

// State
const websites: Website[] = [];

// Website loading
const loadWebsites = async (): Promise<void> => {
    const urls = await SPSEURLLoader();
    urls.forEach(url => {
        websites.push({ 
            https: new WebSite(url.url), 
            classxD: url.classxD 
        });
    });
    console.log(`Websites loaded successfully from data.json: ${websites.length}`);
}

// Sort websites by online status
const sortByOnlineStatus = (data: Website[]): Website[] => {
    return [...data].sort((a, b) => 
        a.https.status === b.https.status ? 0 : a.https.status ? -1 : 1
    );
}

// Express app setup
const app: Express = express();
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req: Request, res: Response) => {
    res.render('pages/index', { websites, url: API_URL });
});

app.get('/api/websites', async (req: Request, res: Response) => {
    try {
        const { data } = await axios.get<Website[]>(WEBSITES_URL);
        res.json(sortByOnlineStatus(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch websites' });
    }
});

app.get('/api/load', async (req: Request, res: Response) => {
    try {
        if (websites.length === 0) {
            await loadWebsites();
        }
        
        await Promise.all(
            websites.map(({ https }) => https.isOnline())
        );
        
        res.json(websites);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load websites' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
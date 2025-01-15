import axios from 'axios';

export default class WebSite {
    private readonly _url: string;
    private _status: boolean | null = null;
    private _lastChecked: number = 0;
    private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

    constructor(url: string) {
        this._url = url;
    }

    get url(): string {
        return this._url;
    }

    get status(): boolean | null {
        return this._status; 
    }

    public async isOnline(): Promise<boolean> {
        // Return cached status if still valid
        if (this._status !== null && Date.now() - this._lastChecked < WebSite.CACHE_DURATION) {
            return this._status;
        }

        try {
            const response = await axios.get(this._url, {
                timeout: 5000, // 5 second timeout
                validateStatus: null // Don't throw on any status code
            });
            
            // Consider 2xx status codes as online
            this._status = response.status >= 200 && response.status < 300;
            this._lastChecked = Date.now();
            
            return this._status;
        } catch (error) {
            this._status = false;
            this._lastChecked = Date.now();
            return false;
        }
    }
}
export default class URLFormatter {
    public static format(url: string): { http: string, https: string } {
        const split = url.split('sftp.');
        if (split.length < 2) {
            throw new Error('Invalid URL ' + url);
        }
        return {http: `http://${split[1]}`, https: `https://${split[1]}`};
    }
}
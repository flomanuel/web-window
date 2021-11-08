const {BrowserWindow, shell} = require('electron');
const AbstractController = require('./AbstractController');


class ExternalWebsiteController extends AbstractController {

    /**
     *
     * @return {{id, url}[]}
     */
    get externalUrls() {
        return this._externalUrls;
    }

    /**
     *
     * @param value
     */
    set externalUrls(value) {
        this._externalUrls = value;
    }

    /**
     *
     * @return {string}
     */
    get url() {
        return this._externalUrl;
    }

    /**
     *
     * @param value
     */
    set url(value) {
        this._externalUrl = value;
    }

    /**
     *
     * @param url
     * @param iconPath
     * @param title
     * @param openAtStartup
     * @param externalUrls
     * @returns {boolean|Promise<void>}
     */
    constructor(url, iconPath, title, openAtStartup, externalUrls) {
        super(iconPath, title, openAtStartup);
        this.url = url;
        this._externalUrls = externalUrls;

        try {
            if (this.validateData()) {
                this.init().catch(e => {
                    throw `Error creating ExternalWebsiteController: ${e}`
                });
            } else {
                return false;
            }
        } catch (e) {
            console.error(`Error creating ExternalWebsiteController: ${e}`)
        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async init() {
        this.win = new BrowserWindow({
            x: 100,
            y: 100,
            width: 1400,
            height: 900,
            autoHideMenuBar: true,
            show: false,
            title: this.title,
            webPreferences: {
                spellcheck: true
            },
            skipTaskbar: true
        });
        super.init();
        await this.win.loadURL(this.url);
        this.win.webContents.setWindowOpenHandler(this.checkIfExternalUrl.bind(this))
    }

    /**
     *
     * @param handlerDetails
     * @return {{action: string}}
     */
    checkIfExternalUrl(handlerDetails) {
        const regexString = this.buildExternalUrlRegex();
        if (new RegExp(regexString).test(handlerDetails.url)) {
            shell.openExternal(handlerDetails.url).catch(e => {
                throw `Failed opening external url with error message: ${e}`;
            })
            return {action: 'deny'}
        } else {
            return {action: 'allow'}
        }
    }

    /**
     *
     * @return {string}
     */
    buildExternalUrlRegex() {
        const extUrlRegexArray = []
        this.externalUrls.forEach(externalUrl => extUrlRegexArray.push(externalUrl.url));
        return extUrlRegexArray.join('|');
    }

    /**
     *
     * @returns {string}
     */
    validateData() {
        if (!this.url) {
            throw 'External URL not specified.';
        } else if (!this.title) {
            throw 'Title not specified.';
        }
        return this.url && this.title;
    }
}

module.exports = ExternalWebsiteController;

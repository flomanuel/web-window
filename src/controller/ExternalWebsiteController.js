const {BrowserWindow, shell} = require('electron');
const AbstractController = require('./AbstractController');
const electronSettings = require("electron-settings");

class ExternalWebsiteController extends AbstractController {

    /**
     *
     * @return {*}
     */
    get externalUrl() {
        return this._externalUrl;
    }

    /**
     *
     * @param value
     */
    set externalUrl(value) {
        this._externalUrl = value;
    }

    /**
     *
     * @param externalUrl
     * @param iconPath
     * @param title
     * @param openAtStartup
     * @returns {boolean|Promise<void>}
     */
    constructor(externalUrl, iconPath, title, openAtStartup) {
        super(iconPath, title, openAtStartup);
        this.externalUrl = externalUrl;

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
        await this.win.loadURL(this.externalUrl);
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
            return { action: 'allow' }
        }
    }

    /**
     *
     * @return {string}
     */
    buildExternalUrlRegex() {
        const websites = electronSettings.getSync('user.websites');
        const extUrlRegex = []
        websites.forEach(ws => {
            ws.externalUrls?.forEach(externalUrl => extUrlRegex.push(externalUrl.url))
        })
        return extUrlRegex.join('|');
    }

    /**
     *
     * @returns {string}
     */
    validateData() {
        if (!this.externalUrl) {
            throw 'External URL not specified.';
        } else if (!this.title) {
            throw 'Title not specified.';
        }
        return this.externalUrl && this.title;
    }
}

module.exports = ExternalWebsiteController;

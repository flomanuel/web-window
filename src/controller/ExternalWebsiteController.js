const {BrowserWindow} = require('electron');
const AbstractController = require('./AbstractController');

class ExternalWebsiteController extends AbstractController {
    /**
     *
     * @param externalUrl
     * @param iconPath
     * @param title
     * @returns {boolean|Promise<void>}
     */
    constructor(externalUrl, iconPath, title) {
        super(iconPath, title);
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
            // icon: this.iconPath,
            webPreferences: {
                spellcheck: true
            },
            skipTaskbar: true
        });
        super.init();
        await this.win.loadURL(this.externalUrl);
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

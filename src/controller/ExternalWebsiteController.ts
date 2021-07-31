import {BrowserWindow} from "electron";
import AbstractController from "./AbstractController";

export default class ExternalWebsiteController extends AbstractController {

    /**
     *
     * @param externalUrl
     * @param iconPath
     * @param title
     */
    constructor(public externalUrl: string, iconPath: string, title: string) {
        super(iconPath, title);

        try {
            if (this.validateData()) {
                this.init().catch(e => {
                    throw `Error creating ExternalWebsiteController: ${e}`
                });
            }
        } catch (e) {
            console.error(`Error creating ExternalWebsiteController: ${e}`)
        }
    }

    /**
     *
     * @protected
     */
    protected async init() {
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
    }

    /**
     *
     * @private
     */
    private validateData() {
        if (!this.externalUrl) {
            throw 'External URL not specified.';
        } else if (!this.title) {
            throw 'Title not specified.';
        }
        return this.externalUrl && this.title;
    }
}
